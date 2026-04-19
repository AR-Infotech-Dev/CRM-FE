const Spinner = ({ size = 'sm', classNames="" }) => (
  <span
    className={`spinner spinner-\${size}`}
    aria-hidden={"true"}
  />
);

export default Spinner;