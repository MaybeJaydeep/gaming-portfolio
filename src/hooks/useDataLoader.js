import { useState, useEffect } from 'react';

export const useDataLoader = (dataLoaders = [], dependencies = []) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate minimum loading time for better UX
        const minLoadTime = new Promise(resolve => setTimeout(resolve, 500));

        // Load all data
        const dataPromises = dataLoaders.map(async loader => {
          try {
            if (typeof loader.load === 'function') {
              const result = await loader.load();
              return { key: loader.key, data: result };
            } else {
              // If it's just static data
              return { key: loader.key, data: loader.data };
            }
          } catch (err) {
            console.error(`Error loading ${loader.key}:`, err);
            return { key: loader.key, data: null, error: err };
          }
        });

        const results = await Promise.all([minLoadTime, ...dataPromises]);
        const dataResults = results.slice(1); // Remove minLoadTime result

        // Combine all data
        const combinedData = {};
        dataResults.forEach(result => {
          combinedData[result.key] = result.data;
          if (result.error) {
            console.warn(`Failed to load ${result.key}:`, result.error);
          }
        });

        setData(combinedData);
      } catch (err) {
        console.error('Data loading error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, dependencies);

  return { loading, error, data };
};

export const useAsyncData = (asyncFunction, dependencies = []) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await asyncFunction();

        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          console.error('Async data loading error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { loading, error, data };
};
