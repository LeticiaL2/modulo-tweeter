import SignUp from '../../molecules/SignUp/SignUp';
import SignIn from '../../molecules/SignIn/SignIn';
import styles from './style.module.scss';

const AuthModal = ({ handleClose, show, isLogin }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';
  const formSizeClassName = isLogin ? 'modal-small' : 'modal-big';

  return (
    <div className={showHideClassName}>
      <section className={`modal-main ${formSizeClassName}`}>
        <div className={styles['modal-close']} onClick={handleClose}>
          x
        </div>
        {isLogin ? (
          <SignIn handleClose={handleClose} />
        ) : (
          <SignUp handleClose={handleClose} />
        )}
      </section>
    </div>
  );
};

export default AuthModal;