import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Trash2, Upload, FileText, 
  Eye, Download, X, FilePlus 
} from 'lucide-react';
import { Document } from '@/types/profile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface DocumentsTabProps {
  documents: Document[];
  onUpdate: (documents: Document[]) => void;
  onUpload: (file: File) => Promise<void>;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents, onUpdate, onUpload }) => {
  const [documentName, setDocumentName] = useState('');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFilename, setPreviewFilename] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      await onUpload(file);
      setDocumentName('');
      setUploadingDocument(false);
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    onUpdate(updatedDocuments);
  };

  const handlePreviewDocument = (url: string, filename: string) => {
    setPreviewUrl(url);
    setPreviewFilename(filename);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewFilename('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getDocumentIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (fileType.includes('image')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('word')) return <FileText className="h-5 w-5 text-blue-700" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Upload and manage your CV, certificates, and other documents</CardDescription>
          </div>
          <Button onClick={() => setUploadingDocument(true)}>
            <FilePlus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload document form */}
        {uploadingDocument && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Drag and drop your file here</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse (PDF, Word, Images)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-name">Document Name (Optional)</Label>
                <Input
                  id="document-name"
                  placeholder="e.g. My Resume"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-center">
                <input
                  id="document-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('document-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setUploadingDocument(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Documents list */}
        <div className="space-y-2">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                {getDocumentIcon(doc.fileType)}
                <div>
                  <p className="font-medium">{doc.name || doc.fileUrl.split('/').pop()}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.uploadDate).toLocaleDateString()} • 
                    {formatFileSize(doc.size)} • 
                    Version {doc.version}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreviewDocument(doc.fileUrl, doc.name)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <a
                  href={doc.fileUrl}
                  download={doc.name}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground"
                >
                  <Download className="h-4 w-4" />
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDocument(doc.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          {documents.length === 0 && !uploadingDocument && (
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded yet. Click "Upload Document" to get started.
            </div>
          )}
        </div>
      </CardContent>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFilename || 'Document Preview'}</DialogTitle>
            <DialogDescription>
              Viewing document preview
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <div className="aspect-[16/9] overflow-hidden rounded-md">
              {previewUrl && (
                <iframe 
                  src={previewUrl} 
                  className="w-full h-[70vh]" 
                  title="Document Preview"
                />
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background"
              onClick={closePreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closePreview}>Close</Button>
            {previewUrl && (
              <a
                href={previewUrl}
                download={previewFilename}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 px-4 py-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}; 