import usePrevious from './usePrevious';

const useHasChanged = (val: any) => {
  const prevVal = usePrevious(val);

  return prevVal !== val;
};


export default useHasChanged;
