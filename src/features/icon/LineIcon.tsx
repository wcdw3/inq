import { IconProps } from '@chakra-ui/react';
import Icon from './Icon';
import { SVGAttributes } from 'react';
import LinePath from './LinePath';

export interface LineIconProps
  extends Pick<SVGAttributes<SVGPathElement>, 'd' | 'strokeWidth'> {
  boxSize: IconProps['boxSize'];
}

export default function LineIcon({ boxSize, d, strokeWidth }: LineIconProps) {
  return (
    <Icon boxSize={boxSize}>
      <LinePath d={d} strokeWidth={strokeWidth} />
    </Icon>
  );
}
