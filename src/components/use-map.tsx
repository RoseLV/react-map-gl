import * as React from 'react';
import {useState, useCallback, useContext} from 'react';

import {MapRef} from '../mapbox/create-ref';

type MountedMapsContextValue = {
  maps: {[id: string]: MapRef};
  onMapMount: (map: MapRef, id: string) => void;
  onMapUnmount: (id: string) => void;
};

export const MountedMapsContext = React.createContext<MountedMapsContextValue>(null);

export const MapProvider: React.FC<{}> = props => {
  const [maps, setMaps] = useState<{[id: string]: MapRef}>({});

  const onMapMount = useCallback(
    (map: MapRef, id: string = 'default') => {
      if (maps[id]) {
        throw new Error(`Multiple maps with the same id: ${id}`);
      }
      setMaps({...maps, [id]: map});
    },
    [maps]
  );

  const onMapUnmount = useCallback(
    (id: string = 'default') => {
      const nextMaps = {...maps};
      delete nextMaps[id];
      setMaps(nextMaps);
    },
    [maps]
  );

  return (
    <MountedMapsContext.Provider
      value={{
        maps,
        onMapMount,
        onMapUnmount
      }}
    >
      {props.children}
    </MountedMapsContext.Provider>
  );
};

export function useMap() {
  const {maps} = useContext(MountedMapsContext);
  return maps;
}