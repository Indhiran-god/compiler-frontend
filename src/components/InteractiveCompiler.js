import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const LANGUAGES = [
  { id: '50', name: 'C', value: 'c' },
  { id: '54', name: 'C++', value: 'cpp' },
  { id: '62', name: 'Java', value: 'java' },
  { id: '71', name: 'Python', value: 'python' },
  { id: '63', name: 'JavaScript', value: 'javascript' },
];

const DEFAULT_CODE = {
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  python: 'print("Hello, World!")',
  javascript: 'console.log("Hello, World!");',
};

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/ws',
  timeout: 20000,
});

const Compiler = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [output, setOutput] = useState([{ text: '$ Ready to execute code', type: 'prompt' }]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionId, setExecutionId] = useState(null);
  const [inputBuffer, setInputBuffer] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const outputEndRef = useRef(null);

  // Scroll to bottom on output change
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // Set default code when language changes
  useEffect(() => {
    setCode(DEFAULT_CODE[language] || '');
  }, [language]);

  // Add output line
  const appendOutput = (text, type = 'output') => {
    setOutput(prev => [...prev, { text, type }]);
  };

  // Run code
  const handleRun = async () => {
    if (!code.trim() || isRunning) return;

    setIsRunning(true);
    appendOutput(`$ Executing ${LANGUAGES.find(l => l.value === language).name} code...`, 'command');

    try {
      const response = await api.post('/run', {
        code,
        language: LANGUAGES.find(l => l.value === language).id,
        input: inputBuffer,
        sessionId,
      });

      if (response.data.sessionId) setSessionId(response.data.sessionId);
      if (response.data.executionId) setExecutionId(response.data.executionId);

      if (response.data.type === 'timeout_error') {
        appendOutput(`[Timeout] ${response.data.output}`, 'error');
        appendOutput('$', 'prompt');
      } else if (response.data.type === 'runtime_error' || response.data.error) {
        appendOutput(`[Error] ${response.data.output}`, 'error');
        appendOutput('$', 'prompt');
      } else {
        appendOutput(response.data.output, 'output');
        appendOutput('$', 'prompt');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      appendOutput(`[Error] ${errorMsg}`, 'error');
      appendOutput('$', 'prompt');
    } finally {
      setIsRunning(false);
      setInputBuffer('');
      setExecutionId(null);
    }
  };

  // Stop execution
  const handleStop = async () => {
    if (!executionId) return;
    setIsRunning(true);
    try {
      await api.post(`/stop/${executionId}`);
      appendOutput('[Execution stopped]', 'output');
    } catch (error) {
      appendOutput(`[Error] ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
      setExecutionId(null);
      appendOutput('$', 'prompt');
    }
  };

  // Clear output
  const handleClear = () => {
    setOutput([{ text: '$ Console cleared', type: 'prompt' }]);
  };

  // Handle editor key events
  const handleKeyDown = (e) => {
    if (e.key === 'F5') {
      e.preventDefault();
      handleRun();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setCode(prev => `${prev.substring(0, start)}    ${prev.substring(end)}`);
      setTimeout(() => e.target.setSelectionRange(start + 4, start + 4), 0);
    }
  };

  // Health check (optional, can be used for status indicator)
  // useEffect(() => {
  //   api.get('/health').catch(() => {});
  // }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Interactive Code Compiler</h1>
        </header>

        <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-lg bg-gray-800">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border-gray-600"
              disabled={isRunning}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`px-4 py-2 rounded font-medium ${
                isRunning ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRunning ? 'Running...' : 'Run (F5)'}
            </button>
            <button
              onClick={handleStop}
              disabled={!isRunning || !executionId}
              className={`px-4 py-2 rounded font-medium ${
                !isRunning || !executionId ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Stop
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded font-medium bg-gray-600 hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Code Editor */}
          <div className="rounded-lg overflow-hidden bg-gray-800">
            <div className="p-3 border-b border-gray-700 font-medium">Editor</div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 font-mono bg-gray-800 text-gray-100 outline-none resize-none"
              style={{ height: '400px' }}
              spellCheck="false"
            />
          </div>

          {/* Terminal Output */}
          <div className="rounded-lg overflow-hidden flex flex-col bg-gray-800">
            <div className="p-3 border-b border-gray-700 font-medium">Terminal</div>
            <div className="flex-1 overflow-auto font-mono p-4 bg-gray-900 text-gray-100">
              {output.map((line, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap ${
                    line.type === 'error' ? 'text-red-400' :
                    line.type === 'command' ? 'text-blue-400' :
                    line.type === 'input' ? 'text-yellow-300' :
                    line.type === 'prompt' ? 'text-green-400' : 'text-gray-300'
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={outputEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;