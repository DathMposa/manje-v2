import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { typeScale, TypographyVariant } from '../../theme/typography';

interface ManjeTextProps extends TextProps {
  variant: TypographyVariant;
  isBrand?: boolean;
}

export const ManjeText: React.FC<ManjeTextProps> = ({ 
  variant, 
  isBrand = false, 
  style, 
  children, 
  ...rest 
}) => {
  // Detect "Manje" string if isBrand is not explicitly set
  const containsManje = typeof children === 'string' && /manje/i.test(children);
  const shouldApplyBrandStyle = isBrand || containsManje;

  const textStyle = [
    typeScale[variant],
    shouldApplyBrandStyle && typeScale['brand'],
    style
  ];

  return (
    <Text style={textStyle} {...rest}>
      {children}
    </Text>
  );
};
