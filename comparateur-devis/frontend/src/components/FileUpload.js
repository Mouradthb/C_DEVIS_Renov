import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentArrowUpIcon, XCircleIcon } from '@heroicons/react/24/outline';

const FileUpload = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    // Limiter à 2 fichiers maximum
    const newFiles = [...files];
    acceptedFiles.forEach(file => {
      if (newFiles.length < 2 && file.type === 'application/pdf') {
        newFiles.push(file);
      }
    });
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 2,
    multiple: true
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-300'
        }`}
      >
        <input {...getInputProps()} />
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-900">
          Glissez-déposez vos fichiers PDF ici
        </p>
        <p className="text-xs text-gray-500">
          ou cliquez pour sélectionner des fichiers (maximum 2 fichiers)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Fichiers sélectionnés:</h4>
          <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between py-3 pl-3 pr-2 text-sm">
                <div className="flex items-center">
                  <DocumentArrowUpIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="truncate max-w-xs">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} kB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;