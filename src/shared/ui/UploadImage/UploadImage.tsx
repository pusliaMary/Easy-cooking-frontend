import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { Download, Trash2 } from "lucide-react";
import styles from "./UploadImage.module.scss";
import { Typography } from "../Typography";
import { getStyles } from "@/shared/lib";
import { Stack } from "../Stack/Stack";

const MAX_FILE_SIZE_MB = 60;
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export interface UploadedImageFile {
  id: string;
  file: File;
  preview: string;
  _id?: string;
}

export interface UploadImageProps {
  value?: UploadedImageFile[];
  onChange?: (value: UploadedImageFile[]) => void;
  onRemoveImage?: (id: string) => void;
  maxFiles?: number;
  expandWhenEmpty?: boolean;
  great?: boolean;
}

export interface UploadImageRef {
  focus: () => void;
}

export const UploadImage = forwardRef<UploadImageRef, UploadImageProps>(
  (
    {
      value = [],
      onChange,
      onRemoveImage,
      maxFiles = 10,
      expandWhenEmpty,
      great,
    },
    ref,
  ) => {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const disabled = value.length >= maxFiles;

    useImperativeHandle(ref, () => ({
      focus: () => {
        fileInputRef.current?.click();
      },
    }));

    const handleAreaClick = (): void => {
      if (!disabled) {
        fileInputRef.current?.click();
      }
    };

    const validateFiles = (selectedFiles: File[]): UploadedImageFile[] => {
      const validFiles: UploadedImageFile[] = [];
      let error = "";

      selectedFiles.forEach((file) => {
        if (!ALLOWED_FORMATS.includes(file.type)) {
          error =
            "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.";
        } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          error = `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
        } else {
          validFiles.push({
            id: uuidv4(),
            file,
            preview: URL.createObjectURL(file),
          });
        }
      });

      setErrorMessage(error || undefined);
      return validFiles;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
      if (e.target.files && e.target.files.length > 0 && !disabled) {
        const validFiles = validateFiles(Array.from(e.target.files));

        if (validFiles.length > 0 && onChange) {
          const newValue = [...value, ...validFiles].slice(0, maxFiles);
          onChange(newValue);
        }
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
      if (!disabled) {
        e.preventDefault();
        setDragActive(true);
      }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
      e.preventDefault();
      setDragActive(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
      if (!disabled) {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const validFiles = validateFiles(Array.from(e.dataTransfer.files));
          if (validFiles.length > 0 && onChange) {
            const newValue = [...value, ...validFiles].slice(0, maxFiles);
            onChange(newValue);
          }
        }
      }
    };

    const removeImage = (id: string): void => {
      const fileToRemove = value.find((file) => file.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      if (fileToRemove?._id && typeof onRemoveImage === "function") {
        onRemoveImage(fileToRemove._id);
      }
      if (onChange) {
        const updatedFiles = value.filter((file) => file.id !== id);
        onChange(updatedFiles);
      }
    };

    const mode: Record<string, boolean | undefined> = {
      [styles.dragActive]: dragActive,
      [styles.disabled]: disabled,
      [styles.expand]: expandWhenEmpty && value.length === 0,
      [styles.great]: great,
    };

    return (
      <div className={getStyles(styles.wrapper, mode, [])}>
        <Stack
          className={getStyles(styles.dropArea, mode, [])}
          direction="column"
          align="center"
          justify="center"
          gap={16}
          onClick={handleAreaClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Stack direction="column" align="center" justify="center" gap={16}>
            <Download color={disabled ? "#ccc" : "black"} size={30} />
            <Typography>
              Drag & Drop or{" "}
              <Typography as="span" className={styles.fileButton}>
                Choose file
              </Typography>{" "}
              to upload
            </Typography>
            <Typography className={styles.fileInfo}>
              {maxFiles && `(Max ${maxFiles} files)`}
            </Typography>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleChange}
              hidden
              disabled={disabled}
              accept={ALLOWED_FORMATS.join(",")}
            />
          </Stack>
          {errorMessage && (
            <Typography as="span" className={styles.errorMessage}>
              {errorMessage}
            </Typography>
          )}
        </Stack>
        {value.map(({ id, preview }) => (
          <div key={id} className={getStyles(styles.previewItem, mode, [])}>
            <img src={preview} alt={id} className={styles.blurBg} />
            <img src={preview} alt={id} className={styles.previewImage} />
            <button
              onClick={() => removeImage(id)}
              className={styles.deleteButton}
            >
              <Trash2 size={35} color="black" />
            </button>
          </div>
        ))}
      </div>
    );
  },
);

UploadImage.displayName = "UploadImage";
