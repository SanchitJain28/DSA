import type { ProblemMeta } from "../../shared/types";

export interface AsteroidCollisionData {
  asteroids: number[];
}

export const meta: ProblemMeta<AsteroidCollisionData> = {
  id: "asteroidcollision",
  title: "Asteroid Collision",
  difficulty: "Medium",
  category: "Stack",
  topicId: "stack",
  theme: "rose",
  description:
    "Simulate asteroid collisions where positive asteroids move right and negative move left. Smaller asteroids explode upon impact.",
  tags: ["Stack", "Simulation", "Array"],
  structures: ["array", "stack"],
  inputSchema: [
    {
      key: "asteroids",
      label: "Asteroid Sizes (+ Right, - Left)",
      type: "array",
      placeholder: "[5, 10, -5]",
    },
  ],
  testCases: [
    {
      id: "tc1",
      name: "Small Incoming Explodes: [5, 10, -5]",
      preview: "Asteroids: [5, 10, -5]",
      data: { asteroids: [5, 10, -5] },
    },
    {
      id: "tc2",
      name: "Mutual Annihilation: [8, -8]",
      preview: "Asteroids: [8, -8]",
      data: { asteroids: [8, -8] },
    },
    {
      id: "tc3",
      name: "Top Explodes: [10, 2, -5]",
      preview: "Asteroids: [10, 2, -5]",
      data: { asteroids: [10, 2, -5] },
    },
    {
      id: "tc4",
      name: "Chain Reaction: [-2, -1, 1, 2]",
      preview: "Asteroids: [-2, -1, 1, 2]",
      data: { asteroids: [-2, -1, 1, 2] },
    },
    {
      id: "tc5",
      name: "Heavy Asteroid Wipeout: [1, -2, -2, -2]",
      preview: "Asteroids: [1, -2, -2, -2]",
      data: { asteroids: [1, -2, -2, -2] },
    },
  ],
};

export default meta;
