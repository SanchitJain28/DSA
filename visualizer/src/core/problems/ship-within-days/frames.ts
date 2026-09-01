import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { toRangeState } from "../../structures/range/helpers";

export function generateFrames(data: {
  weights: number[];
  days: number;
}): Scene[] {
  const { weights, days } = data;
  const builder = new FrameBuilder<Scene>();

  const maxWeight = Math.max(...weights, 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    rangeOpts: { left?: number; right?: number; mid?: number; isMatch?: boolean },
    variables: Record<string, string | number> = {},
    pkgIdx?: number,
  ) => {
    const arrayPointers: Record<string, number> = {};
    if (pkgIdx !== undefined && pkgIdx >= 0 && pkgIdx < weights.length) {
      arrayPointers["PKG"] = pkgIdx;
    }

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: toArrayState(weights, {
          name: "Package Weights",
          pointers: arrayPointers,
          activeIndex: pkgIdx,
        }),
        range: toRangeState(maxWeight, totalWeight, {
          title: "Ship Capacity Search Domain",
          left: rangeOpts.left,
          right: rangeOpts.right,
          mid: rangeOpts.mid,
          isMatch: rangeOpts.isMatch,
        }),
      },
      variables: {
        "allowed days": days,
        ...variables,
      },
    });
  };

  buildFrame(
    "Initialization",
    1,
    `Start shipWithinDays() with ${weights.length} packages to ship in at most ${days} days.`,
    { left: maxWeight, right: totalWeight },
    { "total weight": totalWeight },
  );

  let left = maxWeight;
  buildFrame(
    "Lower Bound",
    2,
    `Lower bound capacity: left = max(weights) = ${left}. Capacity cannot be less than heaviest single package.`,
    { left, right: totalWeight },
    { left, "max weight": maxWeight },
  );

  let right = totalWeight;
  buildFrame(
    "Upper Bound",
    3,
    `Upper bound capacity: right = sum(weights) = ${right}. Capacity needed to ship everything in 1 single day.`,
    { left, right },
    { left, right, "total weight": totalWeight },
  );

  while (left < right) {
    buildFrame(
      "Capacity Range",
      4,
      `Binary search active capacity window: [${left} .. ${right}].`,
      { left, right },
      { left, right, "window": `[${left}..${right}]` },
    );

    const mid = Math.floor((left + right) / 2);

    buildFrame(
      "Probe Capacity",
      5,
      `Probe candidate capacity: mid = ⌊(${left} + ${right}) / 2⌋ = ${mid}.`,
      { left, right, mid },
      { left, right, "candidate capacity": mid },
    );

    // Simulate shipping with capacity = mid
    let totalDays = 1;
    let currentLoad = 0;

    for (let i = 0; i < weights.length; i++) {
      const w = weights[i];

      if (currentLoad + w > mid) {
        totalDays++;
        currentLoad = 0;
        buildFrame(
          "Next Day Needed",
          19,
          `Package ${w} exceeds remaining capacity of current day. Ship departed! Day ${totalDays} started.`,
          { left, right, mid },
          {
            "tested capacity": mid,
            currentDay: totalDays,
            "package weight": w,
          },
          i,
        );
      }

      currentLoad += w;
      buildFrame(
        "Load Package",
        21,
        `Loaded package ${w} on Day ${totalDays}. Day load is ${currentLoad} / ${mid}.`,
        { left, right, mid },
        {
          "tested capacity": mid,
          currentDay: totalDays,
          dayLoad: `${currentLoad}/${mid}`,
        },
        i,
      );
    }

    const reqDays = totalDays;
    const isFeasible = reqDays <= days;

    buildFrame(
      "Simulation Result",
      6,
      `With capacity = ${mid}, total days needed = ${reqDays}. Allowed days = ${days}. Feasible? ${
        isFeasible ? "YES" : "NO"
      }.`,
      { left, right, mid, isMatch: isFeasible },
      {
        "tested capacity": mid,
        "days needed": reqDays,
        feasible: isFeasible ? "YES" : "NO",
      },
    );

    if (reqDays > days) {
      buildFrame(
        "Capacity Too Small",
        7,
        `reqDays (${reqDays}) > ${days} days. Capacity ${mid} is too small! Need higher capacity: left = ${mid + 1}.`,
        { left, right, mid },
        { left: mid + 1, right, action: `left = ${mid + 1}` },
      );
      left = mid + 1;
    } else {
      buildFrame(
        "Capacity Feasible",
        9,
        `reqDays (${reqDays}) <= ${days} days. Capacity ${mid} is feasible! Search for smaller capacity: right = ${mid}.`,
        { left, right, mid, isMatch: true },
        { left, right: mid, action: `right = ${mid}` },
      );
      right = mid;
    }
  }

  buildFrame(
    "★ Optimal Capacity Found",
    13,
    `Binary search converged at left = right = ${left}. Minimum ship capacity required to ship within ${days} days is ${left}.`,
    { left, right, mid: left, isMatch: true },
    {
      "min capacity": left,
      result: left,
    },
  );

  return builder.getFrames();
}

export default generateFrames;
