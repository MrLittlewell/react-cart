import React from 'react';

import "./style.css"
import food from "../../images/cart.png"

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      sale: null,
      inputValue: ''
    }
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  checkPromo(arg) {
    const requestURL = 'settings.json';
    const request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function () {

      const myJson = request.response;
      const parseJsonCode = myJson.map(item => item.promoCodes);
      const hasCodes = parseJsonCode[0].map(item => item);

      console.log(hasCodes)
      if (arg === hasCodes) {
        console.log('TRUE')
        // this.setState({ sale: 10 });
      } else {
        console.log('FALSE')
      }
    }


  }

  render() {

    let localData = localStorage.getItem('localPrice');
    let unParse = JSON.parse(localData)

    let price = unParse !== null ? unParse.price : 500
    let programName = unParse !== null ? unParse.planName : 'Программа не выбрана'

    let haveSale = this.state.sale
    let getPercent = price - (price * haveSale / 100)
    console.log(getPercent)

    return (
      <div className="cart-container">
        <h2 className="cart-title">{programName}</h2>
        <a className="cart-to-menu" href="./menu.html">Выбор меню</a>
        <div className="programm-cart">
          <div className="form-area"><form>
            <div className="form-group">
              <input type="text" name="name" placeholder="Имя" id="cart-name" defaultValue="" required />
            </div>
            <div className="form-group double">
              <input type="text" name="phone" placeholder="Телефон" id="cart-phone" defaultValue="" required />
              <input type="email" name="email" placeholder="Почта" id="cart-email" defaultValue="" />
            </div>
            <div className="form-group">
              <input type="text" name="address" placeholder="Адрес" id="cart-address" defaultValue="" required />
            </div>
            <div className="form-group double">
              <div className="input-field">
                <select name="type" className="browser-default" required onChange={this.handleChange}>
                  <option defaultValue="Наличными курьеру">Наличными курьеру</option>
                  <option defaultValue="Картой курьеру">Картой курьеру</option>
                </select>
              </div>
              <input
                type="text" name="promo"
                placeholder="Промокод"
                id="cart-promo"
                value={this.state.inputValue}
                onChange={evt => this.updateInputValue(evt)}
              />
              <a className="check-code"
                onClick={this.checkPromo.bind(this, this.state.inputValue)}>Check</a>
            </div>
            <input type="text" name="price" defaultValue={getPercent} id="cart-price" />
            <button className="cart__order-button">Заказать</button>
          </form></div>
          <div>
            <h3>Сумма заказа</h3>
            <div className="info-area">
              <p>Всего</p>
              <p><span>{getPercent}</span> BYN</p>
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