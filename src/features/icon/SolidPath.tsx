import { SVGAttributes } from 'react';

export default function LinePath(props: SVGAttributes<SVGPathElement>) {
  return <path fill="currentColor" {...props} />;
}
