import Link from 'next/link';

export function Button({ 
  children, 
  variant = 'primary', 
  href, 
  onClick, 
  className = '', 
  type = 'button',
  ...props 
}) {
  let classes = '';
  
  if (variant === 'link') {
    classes = `link-elegant ${className}`;
  } else if (variant === 'outline') {
    classes = `btn-luxury-outline ${className}`;
  } else {
    classes = `btn-luxury ${className}`;
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
