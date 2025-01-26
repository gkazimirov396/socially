'use client';

import toast from 'react-hot-toast';
import { XIcon } from 'lucide-react';

import { type FileEndpoints, UploadDropzone } from '@/lib/uploadthing';

import { Button } from './ui/button';

interface ImageUploadProps {
  value: string;
  endpoint: FileEndpoints;
  onChange: (url: string) => void;
}

export default function ImageUpload({
  value,
  endpoint,
  onChange,
}: ImageUploadProps) {
  console.log(value);
  if (value) {
    return (
      <div className="relative size-40">
        <img
          src={value}
          alt="Upload"
          className="rounded-md size-40 object-cover"
        />

        <Button
          size="icon"
          variant="destructive"
          onClick={() => onChange('')}
          className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        onChange(res?.[0].url);
      }}
      onUploadError={error => {
        console.error(error);
        toast.error('Failed to upload image');
      }}
    />
  );
}
