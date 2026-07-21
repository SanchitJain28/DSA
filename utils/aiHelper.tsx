import React, { useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import TextInput from 'ink-text-input';
import { askAIHelper } from './ai';

interface AIAssistantProps {
  context: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ context }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Press [?] or [a] to ask a question! Press [Esc] to return.'
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const { stdout } = useStdout();

  const handleSubmit = async (query: string) => {
    if (!query.trim()) return;
    setInput('');
    setHistory(prev => [...prev, `You: ${query}`]);
    setIsThinking(true);
    
    const answer = await askAIHelper(context, query);
    
    setIsThinking(false);
    setHistory(prev => [...prev, `DeepSeek: ${answer}\n`]);
  };

  // Safe height calculation
  const terminalHeight = stdout?.rows || 24;
  // Reserve space for borders (2), title (1), input box (3), padding
  const maxHistoryItems = Math.max(5, Math.floor(terminalHeight / 2));
  
  const displayHistory = history.slice(-maxHistoryItems);

  return (
    <Box flexDirection="column" width="100%" height="100%" borderStyle="single" borderColor="cyan" paddingX={1}>
      <Box height={1} justifyContent="center" marginBottom={1}>
        <Text bold>AI Assistant (DeepSeek)</Text>
      </Box>
      <Box flexGrow={1} flexDirection="column" justifyContent="flex-end">
        {displayHistory.map((msg, i) => {
          const isUser = msg.startsWith('You:');
          const isAI = msg.startsWith('DeepSeek:');
          const color = isUser ? 'cyan' : isAI ? 'magenta' : 'gray';
          return (
             <Box key={i} marginBottom={msg.endsWith('\n') ? 1 : 0}>
               <Text color={color}>{msg.trimEnd()}</Text>
             </Box>
          )
        })}
        {isThinking && (
          <Box>
             <Text color="yellow">DeepSeek is thinking...</Text>
          </Box>
        )}
      </Box>
      <Box borderStyle="single" borderColor="cyan" marginTop={1}>
         <TextInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            placeholder="Type your question..."
         />
      </Box>
    </Box>
  );
};
