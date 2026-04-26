/**
 * StudyAgent — backwards-compatible wrapper around StudyAgentWidget.
 * Existing import sites use `StudyAgent` with { activeTab, currentTopic }.
 * The new widget accepts `isVisible` + `activeTab`-based show/hide logic.
 */
import { isStudying } from "../hooks/useStudyAgent";
import StudyAgentWidget from "./StudyAgentWidget";

interface StudyAgentProps {
  activeTab: string;
  currentTopic: string;
  moduleName?: string;
}

export default function StudyAgent({
  activeTab,
  currentTopic,
  moduleName,
}: StudyAgentProps) {
  const isVisible = isStudying(activeTab);
  return (
    <StudyAgentWidget
      currentTopic={currentTopic}
      moduleName={moduleName}
      isVisible={isVisible}
      activeTab={activeTab}
    />
  );
}
