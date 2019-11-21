import React from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import { subDays } from 'date-fns';
registerLocale("ru", ru);

import "react-datepicker/dist/react-datepicker.css";
import "./style.css"
import food from "../../images/cart.png"

class Form extends React.Component {
  constructor(props) {
    let currentDay = new Date();
    let currentHour = currentDay.getHours();
    super(props);
    this.state = {
      value: undefined,
      sale: null,
      inputValue: '',
      startDate: null,
      setStartDate: currentHour < 12 ? subDays(new Date(), -1) : subDays(new Date(), -2),
      showPromoInfo: false,
      showPromo: false,
    }
  }

  handleDateChange = date => {
    this.setState({
      startDate: date
    });
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  checkPromo(arg) {
    const setConst = this
    const requestURL = 'settings.json';
    const request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function () {

      const myJson = request.response;
      const parseJsonCode = myJson.map(item => item.promoCodes);
      const hasCodes = parseJsonCode[0].map(item => item);

      for (let element of hasCodes) {
        if (arg === element.name) {
          setConst.setState({
            sale: element.value,
            showPromoInfo: true,
            showPromo: true
          });
          break;
        } else {
          setConst.setState({
            showPromoInfo: true,
            showPromo: false
          });
        }
      }
    }
  }

  render() {
    const { sale, showPromoInfo, showPromo, inputValue } = this.state
    let localData = localStorage.getItem('localPrice');
    let unParse = JSON.parse(localData)

    let getDay = unParse !== null ? unParse.day : ''
    let integetDay = parseInt(getDay.match(/\d+/));
    let price = unParse !== null ? unParse.price : 0
    let programName = unParse !== null ? unParse.planName + ` | ${getDay}` : 'Программа не выбрана'

    let haveSale = sale
    let getPercent = price - (price * haveSale / 100);

    return (
      <div className="cart-container">
        <h2 className="cart-title">{programName}</h2>
        <a className="cart-to-menu" href="./menu.html">Выбор меню</a>
        <div className="programm-cart">
          <div className="form-area"><form id="order-form" action="order.php" method="post">
            <div className="form-group">
              <input type="text" name="name" placeholder="Имя" id="cart-name" defaultValue="" required />
            </div>
            <div className="form-group double">
              <input type="text" name="phone" placeholder="Телефон" id="cart-phone" defaultValue="" required />
              <input type="email" name="email" placeholder="Почта" id="cart-email" defaultValue="" />
            </div>
            <div className="form-group">
              <input type="text" name="address" placeholder="Адрес" id="cart-address" defaultValue="" required />
              <input type="text" name="comment" placeholder="Комментарий к доставке... " id="comment" defaultValue="" required />
            </div>
            <div className="form-group double">
              {window.innerWidth >= 960 ?
                <DatePicker
                  name="date"
                  selected={this.state.startDate}
                  onChange={date => this.handleDateChange(date)}
                  minDate={this.state.setStartDate}
                  locale="ru"
                  placeholderText="Выбрать дату доставки"
                  dateFormat="d/MMMM/yyyy"
                /> :
                <DatePicker
                  name="date"
                  selected={this.state.startDate}
                  onChange={date => this.handleDateChange(date)}
                  minDate={this.state.setStartDate}
                  locale="ru"
                  withPortal
                  placeholderText="Выбрать дату доставки"
                  dateFormat="d/MMMM/yyyy"
                />
              }
              <div className="input-field second-select">
                <select name="delivery" className="browser-default" required onChange={this.handleChange}>
                  <option value="#" disabled selected hidden>Время доставки:</option>
                  <option defaultValue="6:00-7:00">6:00-7:00</option>
                  <option defaultValue="7:00-8:00">7:00-8:00</option>
                  <option defaultValue="8:00-9:00">8:00-9:00</option>
                  <option defaultValue="9:00-10:00">9:00-10:00</option>
                  <option defaultValue="10:00-11:00">10:00-11:00</option>
                  <option defaultValue="11:00-12:00">11:00-12:00</option>
                </select>
              </div>
            </div>
            <div className="form-group double">
              <div className="input-field">
                <select name="type" className="browser-default" required onChange={this.handleChange}>
                  <option value="#" disabled selected hidden>Тип оплаты:</option>
                  <option defaultValue="Наличными курьеру">Наличными курьеру</option>
                  <option defaultValue="Картой курьеру">Картой курьеру</option>
                </select>
              </div>
              <input
                type="text" name="promo"
                placeholder="Промокод"
                id="cart-promo"
                value={inputValue}
                onChange={evt => this.updateInputValue(evt)}
              />

              <a className="check-code"
                onClick={this.checkPromo.bind(this, inputValue)}>&#10003;</a>
            </div>
            <input type="text" name="price" defaultValue={getPercent} id="cart-price" />
            <input type="text" name="day" defaultValue={getDay} id="day-plan" />
            <button type="submit" className="cart__order-button" disabled={price === 0 ? true : false}>Заказать</button>
          </form></div>
          <div className="order-info-area">
            <div className="info-area z-depth-4">
              <h3 className="summary-title">Сумма заказа</h3>
              <p>Всего:</p>
              <p><span>{getPercent}</span> BYN</p>
              <p>В день:</p>
              {getPercent === 0 ? 0 + ' BYN' : <p><span>{getPercent / integetDay}</span> BYN</p>}
              {showPromoInfo ? (
                showPromo ?
                  <p className="promo-true">Приминён промокод на {sale}%!</p> :
                  <p className="promo-false">Неверный промокод</p>
              ) : null}
            </div>
            <img src={food} alt="cart" />
          </div>
        </div>
      </div>
    );
  }

  updateInputValue(evt) {
    this.setState({
      inputValue: evt.target.value
    });
  }
}

export default Form;