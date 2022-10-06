import dateAndTime from 'date-and-time';

const formatDate = (dateString: string) => {
  const date = dateAndTime.parse(dateString, 'YYYY-MM-DD[T]HH:mm:ss[.]SSS[Z]', true);

  return dateAndTime.format(date, 'DD.MM.YYYY HH:mm:ss');
};

export default formatDate;
