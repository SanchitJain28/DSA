import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import TreeVisualizer from "@/components/tree-playground/TreeVisualizer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { getProblemPath } from "@/data/problems";
import VisualizerLayout from "@/components/layout/VisualizerLayout";
import { useVisualizerState } from "@/hooks/useVisualizerState";
import type { VisualizerType } from "@/types/visualizer";
import { PROBLEMS_REGISTRY, type ProblemEntry } from "@/core/problems/registry";

export type { VisualizerType };

function GenericProblemRunner({ problemKey }: { problemKey: string }) {
  const problem = PROBLEMS_REGISTRY[problemKey];
  if (!problem) return null;

  return <RunnerInner key={problemKey} problem={problem} />;
}

function RunnerInner({ problem }: { problem: ProblemEntry }) {
  const { meta, source, generateFrames } = problem;

  const initialFrames = useMemo(() => {
    return generateFrames(meta.testCases[0]?.data);
  }, [generateFrames, meta.testCases]);

  const state = useVisualizerState({
    testCases: meta.testCases,
    inputSchema: meta.inputSchema,
    totalFrames: initialFrames.length,
  });

  const frames = useMemo(() => {
    return generateFrames(state.currentData);
  }, [generateFrames, state.currentData]);

  return (
    <VisualizerLayout
      meta={meta}
      source={source}
      frames={frames}
      state={state}
    />
  );
}

export default function VisualizerPage() {
  const navigate = useNavigate();
  const params = useParams<{ topicId?: string; problemId?: string }>();
  const [searchParams] = useSearchParams();

  // Resolve active problem from params (/problems/:topic/:problem or /problems/:problem) or query string (?problem=...)
  const problemFromParams = (params.problemId || searchParams.get("problem")) as VisualizerType | null;

  const [activeTab, setActiveTab] = useState<VisualizerType>(
    problemFromParams || "twosum",
  );

  const handleTabChange = (tab: VisualizerType) => {
    setActiveTab(tab);
    navigate(getProblemPath(tab));
  };

  useEffect(() => {
    if (problemFromParams && problemFromParams !== activeTab) {
      setActiveTab(problemFromParams);
    }
  }, [problemFromParams, activeTab]);

  const isMigrated = activeTab in PROBLEMS_REGISTRY;

  return (
    <SettingsProvider>
      <SidebarProvider defaultOpen={false}>
        <div className="dark flex min-h-screen w-full bg-background text-foreground">
          <AppSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex-1 relative min-h-0 bg-background">
              {isMigrated ? (
                <GenericProblemRunner problemKey={activeTab} />
              ) : activeTab === "treevisualizer" ? (
                <TreeVisualizer />
              ) : null}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </SettingsProvider>
  );
}
