import React from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width: string | number;
  height: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height }) => {
  return (
    <div className={styles.skeleton} style={{ width, height }} />
  );
};


