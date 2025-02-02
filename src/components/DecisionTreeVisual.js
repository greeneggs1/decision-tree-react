import React, { useState, useEffect } from 'react';
import { ChevronRight, Circle, CheckCircle, XCircle } from 'lucide-react';

const DecisionTreeVisual = ({ steps = [], currentStep = 0, answers = [] }) => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (steps && answers) {
      updateNodes();
    }
  }, [currentStep, answers, steps]);

  const updateNodes = () => {
    if (!steps || !answers) return;
    
    const newNodes = answers.map((answer, index) => ({
      question: steps[index]?.question || '',
      answer: answer,
      level: index,
    })).filter(node => node.question); // Only include nodes with questions
    
    setNodes(newNodes);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Decision Path</h3>
      
      <div className="space-y-4">
        {nodes && nodes.map((node, index) => (
          <div key={index} className="flex items-start animate-fadeIn">
            <div className="flex items-center">
              {index > 0 && (
                <div className="w-8 h-8 flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              )}
              {node.answer === "Yes" ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            
            <div className="ml-4 flex-1">
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-medium text-gray-700">{node.question}</p>
                <p className={`text-sm mt-1 ${
                  node.answer === "Yes" ? "text-green-600" : "text-red-600"
                }`}>
                  Answer: {node.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {steps && currentStep < steps.length && (
          <div className="flex items-start opacity-50">
            <div className="flex items-center">
              {nodes && nodes.length > 0 && (
                <div className="w-8 h-8 flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <Circle className="w-8 h-8 text-gray-400" />
            </div>
            <div className="ml-4 flex-1">
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                <p className="font-medium text-gray-700">
                  {steps[currentStep]?.question || 'Loading question...'}
                </p>
                <p className="text-sm mt-1 text-gray-500">Awaiting answer...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {steps && currentStep === steps.length && answers && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-lg font-medium text-blue-800">Decision Summary</h4>
          <p className="text-blue-600 mt-2">
            {answers.filter(a => a === "No").length > 2
              ? "Recommendation: Decline or refer"
              : answers.filter(a => a === "No").length > 0
              ? "Recommendation: Proceed with caution"
              : "Recommendation: Accept the client"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DecisionTreeVisual;
