/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Pagination from 'rc-pagination/lib';
import { connect } from 'react-redux';
import DatePicker from 'react-date-picker';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MealCard from '../MealCard/MealCard';
import Modal from '../MealCard/Modal';

import Loader from '../common/Loader/Loader';
import EmptyContent from '../common/EmptyContent';
import 'rc-pagination/assets/index.css';

import {
  fetchOrders,
  filterOrders,
  deleteOrder
} from '../../actions/ordersAction';

/**
 * @description Orders Component
 *
 * @name Orders
 */
export class Orders extends Component {
  /**
   * Creates an instance of OrderHistory page
   * @param {any} props -
   */
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      searchParam: '',
      start: '',
      end: new Date(),
      showModal: false,
      modalContent: null
    };

    this.onChange = this.onChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
  }

  /**
   * Loads data when component mounts
   *
   * @memberof OrderHistory
   *
   * @returns {*} null
   */
  componentDidMount() {
    this.props.fetchOrders();
  }

  /**
   * Handles input fields text changes
   *
   * @param {*} { target }
   * @memberof Orders
   *
   * @returns {void}
   */
  onChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  /**
   *
   *
   * @description chhoose filter button class
   *
   * @memberof Orders
   *
   * @returns { String }
  */
  filterClassName = () => {
    const { orders: { meals } } = this.props;
    const { isOpen } = this.state;

    if (meals.length > 0) {
      if (isOpen) {
        return 'active';
      }
      return '';
    }
    return 'grayed';
  }

  /**
   * Reset the form fields
   *
   * @memberof Orders
   *
   * @returns {void}
   */
  clearForm() {
    this.setState({
      searchParam: '',
      start: '',
      end: ''
    });
  }

  /**
   * Handles new page request in pagination
   *
   * @memberof Orders
   * @param {number} newPage
   *
   * @returns {void}
   */
  handlePageChange(newPage) {
    const { orders } = this.props;
    if (orders.isFiltered) {
      this.props.filterOrders({ ...this.state, page: newPage });
    } else {
      this.props.fetchOrders(newPage);
    }
  }


  /**
   * Handles search/filter of orders
   *
   * @memberof Orders
   * @returns {void}
   */
  handleFilter() {
    this.setState((state) => {
      this.props.filterOrders(state);
      return { isOpen: false };
    });
  }

  /**
   * Display a summary for pagination
   *
   * @param {number} total
   * @param {array} range
   * @memberof Orders
   *
   * @returns {string} summary
   */
  showTotal(total, range) { //eslint-disable-line
    return `Showing ${range[0]} - ${range[1]} of ${total} items`;
  }

  /**
   * Display a modal to delete a meal
   *
   * @param {object} meal
   * @memberof Orders
   *
   * @returns {void}
   */
  showModal(meal) {
    this.setState({
      modalContent: meal,
      showModal: true
    });
  }

  /**
   * Delete an order
   *
   * @param {string} id
   * @memberof Orders
   *
   * @returns {void}
   */
  deleteOrder(id) {
    this.props.deleteOrder(id)
      .then(() => this.hideModal());
  }

  /**
   * Hide modal
   *
   * @memberof Orders
   *
   * @returns {void}
   */
  hideModal() {
    this.setState({
      showModal: false
    });
  }

  /**
   *
   * This is React render method that render the UI on the dom
   * @function Orders
   *
   * @return { void }
   */
  render() {
    const { match: { url }, orders } = this.props;
    const {
      isOpen, searchParam, start, end
    } = this.state;


    return (
      <Fragment>
        {orders.isLoading && <Loader />}
        <div className={`order-history ${orders.isLoading && 'blurred'}`}>
          <div className="title">
            <span>Order History</span>
            <ToastContainer />
            {orders.isFiltered && <span>&nbsp;(filtered)</span>}
            <div className="filter">
              <button
                disabled={orders.meals.length === 0}
                className={`button ${this.filterClassName()}`}
                type="button"
                onClick={() => this.setState({ isOpen: !isOpen })}
              ><i className="fas fa-filter" />   Filter
              </button>
              <form
                className={`dropdown ${isOpen && "active"}`}
              >
                <div>
                  <input
                    className="input"
                    type="text"
                    name="searchParam"
                    placeholder="Search order"
                    onChange={this.onChange}
                    value={searchParam}
                  />
                </div>
                <div>
                  <label className="date-label" htmlFor="start">Start Date
                    <DatePicker
                      onChange={(date) => this.setState({ start: date })}
                      value={start}
                    />
                  </label>
                </div>
                <div>
                  <label className="date-label" htmlFor="end">End Date
                    <DatePicker
                      onChange={(date) => this.setState({ end: date })}
                      value={end}
                    />
                  </label>
                </div>
                <button
                  className="input btn"
                  type="button"
                  onClick={this.handleFilter}
                  disabled={orders.isLoading}
                >
                  Submit
                </button>
                <div className="actions">
                  <a
                    className="action-item"
                    role="button"
                    tabIndex="0"
                    onClick={() => this.clearForm()}
                  >Clear filters
                  </a>
                  <a
                    className="action-item"
                    role="button"
                    tabIndex="0"
                    onClick={() => this.setState({ isOpen: false })}
                  >Close
                  </a>
                </div>
              </form>
            </div>
          </div>
          {
            orders.error && (
              <div className="network-error">
                {orders.error.response || "Unable to connect to the internet"}
              </div>)
          }
          <Modal
            displayModal={this.state.showModal}
            closeModal={this.hideModal}
            deleteOrder={this.deleteOrder}
            modalContent={this.state.modalContent}
          />
          {
            Array.isArray(orders.orders) && orders.orders.length > 0
              ? (
                <Fragment>
                  <div className="container">
                    {
                      orders.orders.map((meal) => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          showModal={this.showModal}
                        />
                      ))
                    }
                  </div>
                  {
                    orders.orders.length > 0 && (
                      <Pagination
                        locale={{ items_per_page: 'Items' }}
                        onChange={this.handlePageChange}
                        current={+orders.currentPage}
                        pageSize={9}
                        total={+orders.totalRecords}
                        className="pagination"
                        showTotal={this.showTotal}
                      />
                    )
                  }
                </Fragment>
              )
              : (
                <EmptyContent
                  message="No meals available at the moment"
                />
              )
          }
        </div>
      </Fragment>
    );
  }
}

Orders.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  }),
  orders: PropTypes.shape({
    totalRecords: PropTypes.number,
    meals: PropTypes.array
  }),
  filterOrders: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
  deleteOrder: PropTypes.func
};

Orders.defaultProps = {
  orders: {
    meals: [],
    totalRecords: 0
  },
  match: {
    url: '/'
  }
};

const mapStateToProps = state => ({
  orders: state.orders
});

const actionCreators = {
  fetchOrders, filterOrders, deleteOrder
};

export default connect(mapStateToProps, actionCreators)(Orders);
