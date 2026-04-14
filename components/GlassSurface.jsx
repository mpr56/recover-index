import styles from './GlassSurface.module.css';

export default function GlassSurface({
  width             = 'auto',
  height            = 'auto',
  borderRadius      = 24,
  backgroundOpacity = 0.05,
  blur              = 12,
  className         = '',
  style             = {},
  children,
}) {
  const w = typeof width  === 'number' ? `${width}px`  : width;
  const h = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${styles.surface} ${className}`}
      style={{
        width: w, height: h,
        borderRadius: `${borderRadius}px`,
        backdropFilter:       `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor:      `rgba(255,255,255,${backgroundOpacity})`,
        ...style,
      }}
    >
      <div className={styles.glare} style={{ borderRadius: `${borderRadius}px` }} />
      {children}
    </div>
  );
}
