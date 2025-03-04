const formatIndianDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  export default formatIndianDate