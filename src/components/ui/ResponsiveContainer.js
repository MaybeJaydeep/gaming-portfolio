import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

const ResponsiveContainer = ({
  children,
  className = '',
  mobileClass = '',
  tabletClass = '',
  desktopClass = '',
  as: Component = 'div',
  ...props
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const responsiveClass = isMobile
    ? mobileClass
    : isTablet
    ? tabletClass
    : desktopClass;

  const combinedClassName = `${className} ${responsiveClass}`.trim();

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};

export default ResponsiveContainer;
