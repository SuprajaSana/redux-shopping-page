import CartButton from '../Cart/CartButton';
import classes from './MainHeader.module.css';

import { useDispatch } from 'react-redux';
import { uiActions } from '../../store/ui';

const MainHeader = (props) => {
  const dispatch = useDispatch()
  
  const toggleHandler = () => {
    dispatch(uiActions.toggle())
  }

  return (
    <header className={classes.header} onClick={toggleHandler}>
      <h1>ReduxCart</h1>
      <nav>
        <ul>
          <li>
            <CartButton />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;
