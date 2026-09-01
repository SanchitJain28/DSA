import { FrameBuilder } from "../../shared/FrameBuilder";
import type { Scene } from "../../shared/types";
import { toArrayState } from "../../structures/array/helpers";
import { toRangeState } from "../../structures/range/helpers";

export function generateFrames(data: { piles: number[]; h: number }): Scene[] {
  const { piles, h } = data;
  const builder = new FrameBuilder<Scene>();
  const maxPile = Math.max(...piles, 1);

  const buildFrame = (
    phase: string,
    codeLine: number,
    explanation: string,
    rangeOpts: { left?: number; right?: number; mid?: number; isMatch?: boolean },
    variables: Record<string, string | number> = {},
    activePileIdx?: number,
  ) => {
    const arrayPointers: Record<string, number> = {};
    if (activePileIdx !== undefined && activePileIdx >= 0 && activePileIdx < piles.length) {
      arrayPointers["PILE"] = activePileIdx;
    }

    builder.pushFrame({
      phase,
      codeLine,
      explanation,
      structures: {
        array: toArrayState(piles, {
          name: "Banana Piles",
          pointers: arrayPointers,
          activeIndex: activePileIdx,
        }),
        range: toRangeState(1, maxPile, {
          title: "Speed Domain (bananas/hr)",
          left: rangeOpts.left,
          right: rangeOpts.right,
          mid: rangeOpts.mid,
          isMatch: rangeOpts.isMatch,
          unit: " b/h",
        }),
      },
      variables: {
        "allowed hours (h)": `${h} hrs`,
        ...variables,
      },
    });
  };

  buildFrame(
    "Initialization",
    1,
    `Start minEatingSpeed with piles = [${piles.join(", ")}] and deadline h = ${h} hours.`,
    { left: 1, right: maxPile },
    { left: 1, right: maxPile, minSpeed: "Searching" },
  );

  let left = 1;
  let right = maxPile;
  let ans = maxPile;

  buildFrame(
    "Search Range [1 .. max(piles)]",
    2,
    `Speed range is bounded by left = 1 and right = max(piles) = ${maxPile} bananas/hr.`,
    { left: 1, right: maxPile },
    { left: 1, right: maxPile },
  );

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    buildFrame(
      `Probe Speed k = ${mid}`,
      6,
      `Evaluate candidate speed mid = ⌊(${left} + ${right}) / 2⌋ = ${mid} bananas/hr.`,
      { left, right, mid },
      {
        left,
        right,
        "speed k (mid)": `${mid} b/h`,
        totalHours: "Calculating...",
        feasibility: "Evaluating",
      },
    );

    let hours = 0;
    for (let i = 0; i < piles.length; i++) {
      const p = piles[i];
      const pileHrs = Math.ceil(p / mid);
      hours += pileHrs;

      buildFrame(
        `Pile ${i} (${pileHrs} hrs)`,
        9,
        `Pile of ${p} bananas eaten at ${mid} b/h requires ⌈${p}/${mid}⌉ = ${pileHrs} hrs. Running total = ${hours} hrs.`,
        { left, right, mid },
        {
          "speed k (mid)": `${mid} b/h`,
          "current pile": `${p} bananas`,
          "pile hours": `${pileHrs} hrs`,
          "hours so far": `${hours} hrs`,
        },
        i,
      );
    }

    const isFeasible = hours <= h;

    buildFrame(
      `Total Hours: ${hours} hrs`,
      11,
      `At speed ${mid} b/h: Total hours = ${hours} hrs (Allowed deadline: ${h} hrs). Feasible? ${
        isFeasible ? "YES" : "NO"
      }.`,
      { left, right, mid, isMatch: isFeasible },
      {
        "speed k (mid)": `${mid} b/h`,
        "total hours": `${hours} hrs`,
        feasibility: isFeasible ? `Feasible (${hours} <= ${h})` : `Too Slow (${hours} > ${h})`,
      },
    );

    if (hours <= h) {
      ans = mid;
      buildFrame(
        "Feasible: Try Slower",
        12,
        `Speed ${mid} b/h is feasible! Record ans = ${mid}. Try searching for an even slower speed: right = ${mid - 1}.`,
        { left, right, mid, isMatch: true },
        {
          "speed k (mid)": `${mid} b/h`,
          "best speed (ans)": `${ans} b/h`,
          action: `right = ${mid - 1}`,
        },
      );
      right = mid - 1;
    } else {
      buildFrame(
        "Too Slow: Eat Faster",
        15,
        `Total hours (${hours}) > ${h} hrs. Koko cannot finish in time. Must eat faster: left = ${mid + 1}.`,
        { left, right, mid },
        {
          "speed k (mid)": `${mid} b/h`,
          "best speed (ans)": `${ans} b/h`,
          action: `left = ${mid + 1}`,
        },
      );
      left = mid + 1;
    }
  }

  buildFrame(
    "★ Optimal Speed Found",
    18,
    `Search converged! Minimum integer speed to eat all bananas within ${h} hours is ${ans} bananas/hr.`,
    { left: ans, right: ans, mid: ans, isMatch: true },
    {
      "min eating speed": `${ans} bananas/hr`,
      result: `${ans} bananas/hr`,
    },
  );

  return builder.getFrames();
}

export default generateFrames;
