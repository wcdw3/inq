import { SVGAttributes } from 'react';

export default function LinePath(props: SVGAttributes<SVGPathElement>) {
  return (
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}