import { IconProps } from '@chakra-ui/react';
import Icon from './Icon';
import { SVGAttributes } from 'react';
import SolidPath from './SolidPath';

export interface SolidIconProps extends SVGAttributes<SVGPathElement> {
  boxSize: IconProps['boxSize'];
}

export default function LinePathIcon({ boxSize, ...props }: SolidIconProps) {
  return (
    <Icon boxSize={boxSize}>
      <SolidPath {...props} />
    </Icon>
  );
}
