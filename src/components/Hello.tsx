import * as React from 'react';
import { ColorPicker } from 'office-ui-fabric-react/lib/index';

function Hello() {
  return (
    <div className="hello">
        Hello
        <ColorPicker
          color="red"
        />
    </div>
  );
}

export default Hello;
