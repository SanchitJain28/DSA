import { FrameBuilder } from "../../shared/FrameBuilder";
import type { BaseFrame } from "../../shared/types";
import type { ArrayData } from "../../array/types";

export interface KokoFrame extends BaseFrame {
  piles: number[];
  h: number;
  leftSpeed: number;
  rightSpeed: number;
  midSpeed: number | null;
  totalHours: number | null;
  hoursPerPile: number[];
  minFoundSpeed: number | null;
  status: "init" | "evaluating" | "too_slow" | "feasible" | "found";
  arrays?: ArrayData[];
}

export function generateFrames(piles: number[], h: number): KokoFrame[] {
  const builder = new FrameBuilder<KokoFrame>();
  const n = piles.length;
  const maxPile = Math.max(...piles, 1);

  const getEmptyVars = () => ({
    h: `${h} hrs`,
    left: "1",
    right: `${maxPile}`,
    "mid (speed k)": "—",
    totalHours: "—",
    feasibility: "—",
    minSpeed: "Searching",
  });

  const makeArrays = (): ArrayData[] => {
    return [
      {
        id: "piles",
        name: "Banana Piles",
        values: [...piles],
      },
    ];
  };

  if (n === 0) {
    builder.pushFrame({
      phase: "Empty Piles",
      codeLine: 18,
      message: "No banana piles. Eating speed is 0.",
      variables: {
        ...getEmptyVars(),
        minSpeed: "0",
      },
      piles,
      h,
      leftSpeed: 0,
      rightSpeed: 0,
      midSpeed: null,
      totalHours: 0,
      hoursPerPile: [],
      minFoundSpeed: 0,
      status: "found",
      arrays: makeArrays(),
    });
    return builder.getFrames();
  }

  builder.pushFrame({
    phase: "Initialization",
    codeLine: 1,
    message: `Start minEatingSpeed with piles = [${piles.join(", ")}] and deadline h = ${h} hours.`,
    variables: getEmptyVars(),
    piles,
    h,
    leftSpeed: 1,
    rightSpeed: maxPile,
    midSpeed: null,
    totalHours: null,
    hoursPerPile: [],
    minFoundSpeed: null,
    status: "init",
    arrays: makeArrays(),
  });

  // Step 2: Define Bounds
  let left = 1;
  let right = maxPile;

  builder.pushFrame({
    phase: "Search Space [1 .. max(piles)]",
    codeLine: 2,
    message: `Speed search range is bounded by left = 1 banana/hr and right = max(piles) = ${maxPile} bananas/hr.`,
    variables: {
      ...getEmptyVars(),
      left: "1",
      right: String(right),
    },
    piles,
    h,
    leftSpeed: left,
    rightSpeed: right,
    midSpeed: null,
    totalHours: null,
    hoursPerPile: [],
    minFoundSpeed: null,
    status: "init",
    arrays: makeArrays(),
  });

  function getHoursBreakdown(speed: number) {
    const hours = piles.map((p) => Math.ceil(p / speed));
    const total = hours.reduce((acc, val) => acc + val, 0);
    return { hours, total };
  }

  let bestSpeed: number | null = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    builder.pushFrame({
      phase: `Probe Speed k = ${mid}`,
      codeLine: 10,
      message: `Evaluate eating speed mid = ⌊(${left} + ${right}) / 2⌋ = ${mid} bananas/hr.`,
      variables: {
        h: `${h} hrs`,
        left: `${left}`,
        right: `${right}`,
        "mid (speed k)": `${mid} bananas/hr`,
        totalHours: "Calculating...",
        feasibility: "Evaluating",
        minSpeed: bestSpeed !== null ? `${bestSpeed} bananas/hr` : "Searching",
      },
      piles,
      h,
      leftSpeed: left,
      rightSpeed: right,
      midSpeed: mid,
      totalHours: null,
      hoursPerPile: [],
      minFoundSpeed: bestSpeed,
      status: "evaluating",
      arrays: makeArrays(),
    });

    const { hours, total: totalHours } = getHoursBreakdown(mid);

    builder.pushFrame({
      phase: `Calculate Total Hours (${totalHours} hrs)`,
      codeLine: 11,
      message: `At speed k = ${mid} bananas/hr: Total hours needed = ${hours.join(" + ")} = ${totalHours} hrs (Allowed deadline: h = ${h} hrs).`,
      variables: {
        h: `${h} hrs`,
        left: `${left}`,
        right: `${right}`,
        "mid (speed k)": `${mid} bananas/hr`,
        totalHours: `${totalHours} hrs`,
        feasibility:
          totalHours <= h
            ? `Feasible (${totalHours} <= ${h})`
            : `Too Slow (${totalHours} > ${h})`,
        minSpeed: bestSpeed !== null ? `${bestSpeed} bananas/hr` : "Searching",
      },
      piles,
      h,
      leftSpeed: left,
      rightSpeed: right,
      midSpeed: mid,
      totalHours,
      hoursPerPile: hours,
      minFoundSpeed: bestSpeed,
      status: totalHours <= h ? "feasible" : "too_slow",
      arrays: makeArrays(),
    });

    if (totalHours > h) {
      builder.pushFrame({
        phase: `Too Slow: ${totalHours} > ${h} hrs`,
        codeLine: 12,
        message: `Total hours (${totalHours}) > ${h} hrs. Koko cannot finish all bananas in time. Must eat faster! Set left = mid + 1 = ${mid + 1}.`,
        variables: {
          h: `${h} hrs`,
          left: `${left}`,
          right: `${right}`,
          "mid (speed k)": `${mid} bananas/hr`,
          totalHours: `${totalHours} hrs`,
          feasibility: `Infeasible (${totalHours} > ${h})`,
          minSpeed:
            bestSpeed !== null ? `${bestSpeed} bananas/hr` : "Searching",
        },
        piles,
        h,
        leftSpeed: left,
        rightSpeed: right,
        midSpeed: mid,
        totalHours,
        hoursPerPile: hours,
        minFoundSpeed: bestSpeed,
        status: "too_slow",
        arrays: makeArrays(),
      });

      left = mid + 1;
    } else {
      bestSpeed = mid;

      builder.pushFrame({
        phase: `Feasible: ${totalHours} <= ${h} hrs`,
        codeLine: 14,
        message: `Total hours (${totalHours}) <= ${h} hrs. Feasible eating speed! Try searching for an even slower speed: right = mid - 1 = ${mid - 1}.`,
        variables: {
          h: `${h} hrs`,
          left: `${left}`,
          right: `${right}`,
          "mid (speed k)": `${mid} bananas/hr`,
          totalHours: `${totalHours} hrs`,
          feasibility: `Feasible (${totalHours} <= ${h})`,
          minSpeed: `${bestSpeed} bananas/hr`,
        },
        piles,
        h,
        leftSpeed: left,
        rightSpeed: right,
        midSpeed: mid,
        totalHours,
        hoursPerPile: hours,
        minFoundSpeed: bestSpeed,
        status: "feasible",
        arrays: makeArrays(),
      });

      right = mid - 1;
    }
  }

  // Final convergence: left is minimal speed
  const finalSpeed = left;
  const { hours: finalHours, total: finalTotal } =
    getHoursBreakdown(finalSpeed);

  builder.pushFrame({
    phase: `★ Optimal Minimum Speed: ${finalSpeed} bananas/hr`,
    codeLine: 18,
    message: `Search converged at left = ${finalSpeed}. Minimum integer eating speed to finish within ${h} hours is ${finalSpeed} bananas/hr (taking ${finalTotal} hrs).`,
    variables: {
      h: `${h} hrs`,
      left: `${finalSpeed}`,
      right: `${right}`,
      "mid (speed k)": `${finalSpeed} bananas/hr`,
      totalHours: `${finalTotal} hrs`,
      feasibility: `Optimal (${finalTotal} <= ${h})`,
      minSpeed: `${finalSpeed} bananas/hr`,
    },
    piles,
    h,
    leftSpeed: finalSpeed,
    rightSpeed: finalSpeed,
    midSpeed: finalSpeed,
    totalHours: finalTotal,
    hoursPerPile: finalHours,
    minFoundSpeed: finalSpeed,
    status: "found",
    arrays: makeArrays(),
    activeNodeIds: piles.map((_, i) => `piles-${i}`),
  });

  return builder.getFrames();
}
