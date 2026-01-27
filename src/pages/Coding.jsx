import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiFolder, FiFile, FiEye, FiCode, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';

const Coding = () => {
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [expandedFolders, setExpandedFolders] = useState(['src']);

  const toggleFolder = (folder) => {
    setExpandedFolders(prev =>
      prev.includes(folder)
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const fileTree = [
    { type: 'folder', name: 'src', children: [
      { type: 'file', name: 'App.jsx' },
      { type: 'file', name: 'index.jsx' },
      { type: 'file', name: 'styles.css' },
    ]},
    { type: 'folder', name: 'public', children: [
      { type: 'file', name: 'index.html' },
    ]},
    { type: 'file', name: 'package.json' },
  ];

  const renderFileTree = (items, level = 0) => {
    return items.map((item, index) => (
      <div key={index} style={{ paddingLeft: `${level * 16}px` }}>
        {item.type === 'folder' ? (
          <div>
            <button
              onClick={() => toggleFolder(item.name)}
              className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded w-full text-left"
              data-testid={`folder-${item.name}`}
            >
              {expandedFolders.includes(item.name) ? (
                <FiChevronDown className="w-4 h-4" />
              ) : (
                <FiChevronRight className="w-4 h-4" />
              )}
              <FiFolder className="w-4 h-4 text-blue-600" />
              <span className="text-sm">{item.name}</span>
            </button>
            {expandedFolders.includes(item.name) && item.children && (
              <div>{renderFileTree(item.children, level + 1)}</div>
            )}
          </div>
        ) : (
          <button
            className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded w-full text-left"
            data-testid={`file-${item.name}`}
          >
            <FiFile className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm">{item.name}</span>
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" data-testid="coding-page">
      <Navbar />

      <div className="pt-16 h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Prompt/Chat UI */}
          <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col" data-testid="prompt-panel">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4"
              >
                <p className="text-sm font-medium mb-2">Welcome to DevRo! 👋</p>
                <p className="text-sm opacity-90">
                  Describe the website you want to build, and I'll generate the code for you.
                </p>
              </motion.div>

              {/* Example prompts */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Try these examples:</p>
                <button
                  onClick={() => setPrompt('Create a modern landing page for a SaaS product')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  data-testid="example-prompt-1"
                >
                  Create a modern landing page for a SaaS product
                </button>
                <button
                  onClick={() => setPrompt('Build a portfolio website with dark mode')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  data-testid="example-prompt-2"
                >
                  Build a portfolio website with dark mode
                </button>
                <button
                  onClick={() => setPrompt('Create a blog website with responsive design')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  data-testid="example-prompt-3"
                >
                  Create a blog website with responsive design
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your website..."
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white"
                  data-testid="prompt-input"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                  data-testid="send-prompt-button"
                >
                  <FiSend className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview/Files */}
          <div className="flex-1 flex flex-col" data-testid="preview-panel">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  data-testid="preview-tab"
                >
                  <FiEye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                    activeTab === 'files'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  data-testid="files-tab"
                >
                  <FiCode className="w-4 h-4" />
                  <span>Files</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto p-4">
              {activeTab === 'preview' ? (
                <div className="h-full flex items-center justify-center" data-testid="preview-content">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <FiEye className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Preview Area
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      Enter a prompt to generate your website, and see the live preview here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full" data-testid="files-content">
                  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <FiFolder className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">File Structure</h3>
                    </div>
                    <div className="space-y-1 text-gray-900 dark:text-white">
                      {renderFileTree(fileTree)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coding;