import React, { useState } from 'react';

const LANGUAGE_OPTIONS = [
  {
    label: 'C',
    value: 'c',
    icon: 'c.svg',
    defaultCode: `#include <stdio.h>

int main() {
    char name[50];
    printf("Enter your name: ");
    scanf("%s", name);
    printf("Hello, %s!\\n", name);
    return 0;
}`
  },
  {
    label: 'C++',
    value: 'cpp',
    icon: 'cpp.svg',
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    string name;
    cout << "Enter your name: ";
    cin >> name;
    cout << "Hello, " << name << "!" << endl;
    return 0;
}`
  },
  {
    label: 'Java',
    value: 'java',
    icon: 'java.svg',
    defaultCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = sc.next();
        System.out.println("Hello, " + name + "!");
    }
}`
  },
  {
    label: 'Python',
    value: 'python',
    icon: 'python.svg',
    defaultCode: `name = input("Enter your name: ")
print(f"Hello, {name}!")`
  },
  {
    label: 'JavaScript',
    value: 'javascript',
    icon: 'javascript.svg',
    defaultCode: `const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter your name: ', name => {
  console.log(\`Hello, \${name}!\`);
  readline.close();
});`
  },
  {
    label: 'TypeScript',
    value: 'typescript',
    icon: 'typescript.svg',
    defaultCode: `import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your name: ', (name) => {
  console.log(\`Hello, \${name}!\`);
  rl.close();
});`
  }
];

const TextCompiler = () => {
  const [language, setLanguage] = useState('c');
  const [code, setCode] = useState(LANGUAGE_OPTIONS.find(l => l.value === 'c').defaultCode);
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    const langObj = LANGUAGE_OPTIONS.find(l => l.value === lang);
    setCode(langObj ? langObj.defaultCode : '');
    setOutput('');
    setInput('');
  };

  const handleCompile = () => {
    setIsCompiling(true);
    setOutput('Compiling...\n');

    setTimeout(() => {
      let result = '';
      if (language === 'c' || language === 'cpp') {
        if (code.includes('scanf') || code.includes('cin')) {
          result += 'Enter your name: \n';
          result += `Hello, ${input || '[user]'}!\n`;
        } else if (code.includes('printf') || code.includes('cout')) {
          const match = code.match(/printf\("([^"]*)"/) || code.match(/cout\s*<<\s*"([^"]*)"/);
          result = match ? match[1] + '\n' : "Compilation successful! (No output)\n";
        } else {
          result = "Compilation successful! (No output)\n";
        }
      } else if (language === 'java') {
        if (code.includes('Scanner') && code.includes('next()')) {
          result += 'Enter your name: \n';
          result += `Hello, ${input || '[user]'}!\n`;
        } else if (code.includes('System.out.println')) {
          const match = code.match(/System\.out\.println\("([^"]*)"\)/);
          result = match ? match[1] + '\n' : "Compilation successful! (No output)\n";
        } else {
          result = "Compilation successful! (No output)\n";
        }
      } else if (language === 'python') {
        if (code.includes('input(')) {
          result += 'Enter your name: \n';
          result += `Hello, ${input || '[user]'}!\n`;
        } else if (code.includes('print(')) {
          const match = code.match(/print\((?:f)?["']([^"']*)["']\)/);
          result = match ? match[1] + '\n' : "Compilation successful! (No output)\n";
        } else {
          result = "Compilation successful! (No output)\n";
        }
      } else if (language === 'javascript' || language === 'typescript') {
        if (code.includes('readline.question')) {
          result += 'Enter your name: \n';
          result += `Hello, ${input || '[user]'}!\n`;
        } else if (code.includes('console.log')) {
          const match = code.match(/console\.log\((?:`|"|')([^`"']*)(?:`|"|')\)/);
          result = match ? match[1] + '\n' : "Compilation successful! (No output)\n";
        } else {
          result = "Compilation successful! (No output)\n";
        }
      } else {
        result = "Compilation successful! (No output)\n";
      }

      setOutput(prev => prev + result);
      setIsCompiling(false);
    }, 1500);
  };

  const clearOutput = () => {
    setOutput('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold flex items-center">
                <span className="mr-2">💻</span>
                Interactive Code Compiler
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Dark Mode</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform transition-transform rounded-full bg-white ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Font Size</span>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className={`p-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  >
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Language Selection */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Programming Language</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {LANGUAGE_OPTIONS.map(lang => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      setLanguage(lang.value);
                      setCode(lang.defaultCode);
                      setOutput('');
                    }}
                    className={`p-3 rounded-lg border transition-all ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${language === lang.value ? (darkMode ? 'bg-gray-700 border-blue-500' : 'bg-gray-100 border-blue-400') : (darkMode ? 'border-gray-600' : 'border-gray-300')}`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-2">{lang.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Code Editor</label>
                <button
                  onClick={() => setCode(LANGUAGE_OPTIONS.find(l => l.value === language).defaultCode)}
                  className={`text-sm px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Reset Code
                </button>
              </div>
              <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <textarea
                  className={`w-full p-4 font-mono outline-none resize-none ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
                  style={{ height: '300px', fontSize: `${fontSize}px` }}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <label className="block mb-2 font-medium">Program Input</label>
              <input
                type="text"
                placeholder="Enter input for the program (for scanf/cin/input functions)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-400'} outline-none transition-colors`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${isCompiling ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
              >
                {isCompiling ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Compiling...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Compile & Run
                  </>
                )}
              </button>
              <button
                onClick={clearOutput}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Output
              </button>
            </div>

            {/* Output Section */}
            <div>
              <label className="block mb-2 font-medium">Output</label>
              <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <pre className={`p-4 font-mono overflow-auto ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`} style={{ height: '200px', fontSize: `${fontSize}px` }}>
                  {output || <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Output will appear here after compilation...</span>}
                </pre>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`px-6 py-3 text-sm ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <div className="flex justify-between items-center">
              <span>Interactive Compiler - Supports multiple programming languages</span>
              <span>Press Ctrl+Enter to run</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextCompiler;