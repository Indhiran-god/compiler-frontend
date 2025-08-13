import React, { useState } from 'react';

// Initial C code for single file
const initialCode = `#include <stdio.h>

int main() {
    char name[50];
    int age;
    printf("Enter your name: ");
    scanf("%s", name);
    printf("Enter your age: ");
    scanf("%d", &age);
    printf("Hello, %s! You are %d years old.\\n", name, age);
    return 0;
}`;

const BatchCompiler = () => {
  const [code, setCode] = useState(initialCode);
  const [inputs, setInputs] = useState(["", "", ""]);
  const [outputs, setOutputs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Handle code change
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  // Handle input change for each input box
  const handleInputChange = (idx, value) => {
    const updated = [...inputs];
    updated[idx] = value;
    setInputs(updated);
  };

  // Simulate running the code for each input
  const handleRunBatch = () => {
    setIsRunning(true);
    setOutputs([]);
    setTimeout(() => {
      // For each input, simulate running the code
      const newOutputs = inputs.map((inputStr, idx) => {
        // Simulate scanf: split input by whitespace
        const inputParts = inputStr.trim().split(/\s+/);
        let name = inputParts[0] || "[name]";
        let age = inputParts[1] || "[age]";
        let out = "";
        if (code.includes('scanf("%s", name') || code.includes('scanf("%s",') || code.includes('scanf("%s", name)')) {
          out += "Enter your name: \n";
        }
        if (code.includes('scanf("%d", &age') || code.includes('scanf("%d",') || code.includes('scanf("%d", &age)')) {
          out += "Enter your age: \n";
        }
        if (code.includes('printf("Hello, %s! You are %d years old.\\n", name, age)')) {
          out += `Hello, ${name}! You are ${age} years old.\n`;
        } else if (code.includes('printf("Hello, %s!\\n", name)')) {
          out += `Hello, ${name}!\n`;
        } else if (code.includes('printf(')) {
          // Try to extract printf string
          const match = code.match(/printf\("([^"]*)"\)/);
          out += match ? match[1] : "Program executed.";
        } else {
          out += "Program executed.";
        }
        return out;
      });
      setOutputs(newOutputs);
      setIsRunning(false);
    }, 1200);
  };

  // Add more input boxes
  const handleAddInput = () => {
    setInputs([...inputs, ""]);
  };

  // Remove an input box
  const handleRemoveInput = (idx) => {
    if (inputs.length <= 1) return;
    const updated = inputs.filter((_, i) => i !== idx);
    setInputs(updated);
    setOutputs([]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Batch C Input Executor</h2>
      <p className="mb-4 text-gray-700">
        Enter your C code and provide multiple sets of inputs. The code will be executed for each input set in batch.
      </p>
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">C Code:</label>
        <textarea
          className="w-full h-56 p-3 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={code}
          onChange={handleCodeChange}
          spellCheck="false"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">Batch Inputs:</label>
        <div className="space-y-2">
          {inputs.map((input, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder='e.g. Alice 23'
                value={input}
                onChange={e => handleInputChange(idx, e.target.value)}
              />
              {inputs.length > 1 && (
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleRemoveInput(idx)}
                  title="Remove input"
                  type="button"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          className="mt-3 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleAddInput}
          type="button"
        >
          + Add Input
        </button>
      </div>
      <button
        className={`mt-2 px-4 py-2 rounded-md text-white ${
          isRunning ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors`}
        onClick={handleRunBatch}
        disabled={isRunning}
      >
        {isRunning ? 'Running...' : 'Run Batch'}
      </button>
      {outputs.length > 0 && (
        <div className="mt-6 p-3 bg-gray-900 text-green-200 border border-gray-800 rounded-md">
          <h4 className="font-semibold mb-2 text-yellow-300">Batch Output:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            {outputs.map((out, idx) => (
              <li key={idx}>
                <div className="mb-1 text-gray-400">Input {idx + 1}: <span className="text-white">{inputs[idx]}</span></div>
                <pre className="font-mono text-sm whitespace-pre-wrap">{out}</pre>
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-500">
        <small>
          Note: This is a simulation. Only basic C input/output is supported. Each input is run separately.
        </small>
      </div>
    </div>
  );
};

export default BatchCompiler;
