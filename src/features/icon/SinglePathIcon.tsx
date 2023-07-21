import { IconProps } from '@chakra-ui/react';
import Icon from './Icon';
import Path from './Path';
import { SVGAttributes } from 'react';

export interface SinglePathIconProps
  extends Pick<SVGAttributes<SVGPathElement>, 'd' | 'strokeWidth'> {
  boxSize: IconProps['boxSize'];
}

export default function SinglePathIcon({
  boxSize,
  d,
  strokeWidth,
}: SinglePathIconProps) {
  return (
    <Icon boxSize={boxSize}>
      <Path d={d} strokeWidth={strokeWidth} />
    </Icon>
  );
}
