import { FrameBuilder } from "../../shared/FrameBuilder";
import type { ArrayFrame, ArrayData } from "../../array/types";

export function generateFrames(weights: number[], days: number): ArrayFrame[] {
  const builder = new FrameBuilder<ArrayFrame>();

  const maxWeight = Math.max(...weights);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const getBaseFrame = (
    codeLine: number,
    phase: string,
    message: string,
    variables: Record<string, string | number> = {},
    activePackageIdx?: number,
    dayGroups?: number[][],
    activeNodeId?: string
  ): ArrayFrame => {
    const arrays: ArrayData[] = [
      {
        id: "weights",
        name: "Package Weights",
        values: [...weights],
        pointers: activePackageIdx !== undefined ? { pkg: activePackageIdx } : undefined,
      },
    ];

    if (dayGroups && dayGroups.length > 0) {
      arrays.push({
        id: "dayGroups",
        name: "Ship Daily Loads",
        values: dayGroups.map((group, idx) => {
          const sum = group.reduce((a, b) => a + b, 0);
          return `Day ${idx + 1}: [${group.join(",")}] = ${sum}`;
        }),
      });
    }

    return {
      callStack: [],
      phase,
      codeLine,
      message,
      variables: {
        "max allowed days": days,
        ...variables,
      },
      activeNodeId,
      arrays,
    };
  };

  // Line 1: Function entry
  builder.pushFrame(
    getBaseFrame(
      1,
      "Initialization",
      `Start shipWithinDays() with ${weights.length} packages to ship in at most ${days} days.`,
      { "total weight": totalWeight }
    )
  );

  let left = maxWeight;
  // Line 2: left = Math.max(...weights)
  builder.pushFrame(
    getBaseFrame(
      2,
      "Lower Bound Capacity",
      `Calculate lower bound: left = max(weights) = ${left}. Ship capacity cannot be less than the heaviest single package.`,
      { left, "max weight": maxWeight }
    )
  );

  let right = totalWeight;
  // Line 3: right = sum(weights)
  builder.pushFrame(
    getBaseFrame(
      3,
      "Upper Bound Capacity",
      `Calculate upper bound: right = sum(weights) = ${right}. Ship capacity needed to ship all packages in 1 day.`,
      { left, right, "total weight": totalWeight }
    )
  );

  while (left < right) {
    // Line 4: while (left < right)
    builder.pushFrame(
      getBaseFrame(
        4,
        "Binary Search Range",
        `Binary search active capacity range: [left: ${left} ... right: ${right}].`,
        { left, right, "capacity window": `[${left}..${right}]` }
      )
    );

    const mid = Math.floor((left + right) / 2);

    // Line 5: mid = Math.floor((left + right) / 2)
    builder.pushFrame(
      getBaseFrame(
        5,
        "Test Capacity (mid)",
        `Test candidate ship capacity: mid = Math.floor((${left} + ${right}) / 2) = ${mid}.`,
        { left, right, "candidate capacity (mid)": mid }
      )
    );

    // Simulate getTotalDays(weights, mid)
    let totalDays = 1;
    let currentWeight = 0;
    const currentDayGroups: number[][] = [[]];

    // Line 12-13: Start getTotalDays
    builder.pushFrame(
      getBaseFrame(
        13,
        "Simulate Shipping",
        `Simulating shipment with capacity = ${mid}: Start Day 1 with currentWeight = 0.`,
        { left, right, mid, "tested capacity": mid, currentDay: 1, currentWeight: 0 },
        0,
        currentDayGroups
      )
    );

    for (let i = 0; i < weights.length; i++) {
      const weight = weights[i];

      if (currentWeight + weight > mid) {
        // Line 15-16: Exceeds capacity, advance to next day
        totalDays++;
        currentWeight = 0;
        currentDayGroups.push([]);

        builder.pushFrame(
          getBaseFrame(
            16,
            "New Ship Day Needed",
            `Package ${weight} exceeds remaining capacity (${mid - currentWeight}). Ship departed! Start Day ${totalDays} for package ${weight}.`,
            { left, right, mid, currentDay: totalDays, "package weight": weight, "capacity": mid },
            i,
            currentDayGroups,
            `weights-${i}`
          )
        );
      }

      currentWeight += weight;
      currentDayGroups[currentDayGroups.length - 1].push(weight);

      // Line 18: Loaded package
      builder.pushFrame(
        getBaseFrame(
          18,
          "Load Package",
          `Loaded package ${weight} on Day ${totalDays}. Day load is now ${currentWeight} / ${mid}.`,
          {
            left,
            right,
            mid,
            currentDay: totalDays,
            dayLoad: `${currentWeight}/${mid}`,
            "total days so far": totalDays,
          },
          i,
          currentDayGroups,
          `weights-${i}`
        )
      );
    }

    // Line 20: return totalDays
    const reqDays = totalDays;
    builder.pushFrame(
      getBaseFrame(
        20,
        "Simulation Result",
        `With capacity = ${mid}, total days required = ${reqDays}. Allowed days = ${days}.`,
        { left, right, mid, reqDays, days, feasible: reqDays <= days ? "YES" : "NO" },
        undefined,
        currentDayGroups
      )
    );

    // Line 7-8: Binary search decision
    if (reqDays > days) {
      // Line 7: if (reqDays > days) left = mid + 1
      builder.pushFrame(
        getBaseFrame(
          7,
          "Capacity Too Small",
          `reqDays (${reqDays}) > days (${days}). Capacity ${mid} is too small! Need higher capacity. Set left = mid + 1 = ${mid + 1}.`,
          { left, right, mid, reqDays, days, action: `left = ${mid + 1}` },
          undefined,
          currentDayGroups
        )
      );
      left = mid + 1;
    } else {
      // Line 8: else right = mid
      builder.pushFrame(
        getBaseFrame(
          8,
          "Capacity Feasible",
          `reqDays (${reqDays}) <= days (${days}). Capacity ${mid} is feasible! Try smaller or equal capacity. Set right = mid = ${mid}.`,
          { left, right, mid, reqDays, days, action: `right = ${mid}` },
          undefined,
          currentDayGroups
        )
      );
      right = mid;
    }
  }

  // Line 10: return left
  builder.pushFrame(
    getBaseFrame(
      10,
      "Minimum Capacity Found",
      `Binary search converged (left === right === ${left}). Minimum ship capacity required to ship all packages in ${days} days is ${left}.`,
      { left, right, result: left, "min capacity": left }
    )
  );

  return builder.getFrames();
}
