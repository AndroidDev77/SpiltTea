import React, { useState, useRef } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Spinner,
  Text,
} from '@fluentui/react-components';
import {
  Image24Regular,
  Dismiss24Regular,
  ArrowUpload24Regular,
} from '@fluentui/react-icons';
import { storageApi } from '../../api';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('24px'),
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground2,
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  uploadAreaDragging: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
  },
  uploadIcon: {
    fontSize: '32px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  uploadText: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  previewContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  preview: {
    width: '120px',
    height: '120px',
    ...shorthands.borderRadius('8px'),
    objectFit: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
  },
  hiddenInput: {
    display: 'none',
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
  },
});

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Photo',
}) => {
  const styles = useStyles();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const publicUrl = await storageApi.uploadFile(file);
      onChange(publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      {label && <Text weight="semibold">{label}</Text>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className={styles.hiddenInput}
      />

      {value ? (
        <div className={styles.previewContainer}>
          <img src={value} alt="Preview" className={styles.preview} />
          <Button
            appearance="primary"
            size="small"
            icon={<Dismiss24Regular />}
            className={styles.removeButton}
            onClick={handleRemove}
          />
        </div>
      ) : (
        <div
          className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaDragging : ''}`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <Spinner size="small" label="Uploading..." />
          ) : (
            <>
              <ArrowUpload24Regular className={styles.uploadIcon} />
              <Text className={styles.uploadText}>
                Click or drag image to upload
              </Text>
            </>
          )}
        </div>
      )}

      {error && <Text className={styles.error}>{error}</Text>}
    </div>
  );
};
