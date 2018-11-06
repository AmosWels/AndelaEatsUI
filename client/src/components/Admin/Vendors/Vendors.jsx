import React, { Component } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import { VendorCard } from './VendorCard';
import Loader from '../../common/Loader/Loader';
import {
  fetchVendors,
  deleteVendor,
  createVendor,
  updateVendor
} from '../../../actions/vendorsAction';
import Modal from "./Modal";
import DeleteVendorModal from "./DeleteVendorModal";
import inputValidation from '../../../helpers/inputValidation';
import EmptyContent from '../../common/EmptyContent';

/**
 *
 *
 * @class Vendors
 * @extends {Component}
 */
export class Vendors extends Component {
  static initialState = () => ({
    id: '',
    name: '',
    address: '',
    contactPerson: '',
    tel: '',
    errors: {},
    displayModal: false,
    displayDeleteModal: false,
    modalContent: {},
    modalTitle: '',
    modalButtontext: ''
  });

  constructor(props) {
    super(props);
    this.state = Vendors.initialState();
  }
  
  componentDidMount() {
    this.props.fetchVendors();
  }
  
  /**
   * Handles input fields text changes
   *
   * @param {object} event
   *
   * @memberof AddVendorModal
   * 
   * @returns {void}
   */
  onChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  /**
   * 
   * @method showAddModal
   *
   * 
   * @memberof Vendors
   * 
   * @returns {void}
   */
  showAddModal = () => {
    this.setState({
      modalTitle: "ADD VENDOR",
      modalButtontext: "Add Vendor",
      displayModal: true
    });
  }

  /**
   * 
   * @method showEditModal
   *
   * @param {object} vendor
   * 
   * @memberof Vendors
   * 
   * @returns {void}
   */
  showEditModal = (vendor) => {
    const {
      id, name, address, contactPerson, tel 
    } = vendor
    this.setState({
      modalTitle: "EDIT VENDOR",
      modalButtontext: "Update",
      id,
      name,
      address,
      contactPerson,
      tel,
      displayModal: true,
    });
  }


  /**
   * Handles form submission
   * 
   * @param {object} vendorDetails
   * 
   * @memberof Vendor
   * 
   * @returns {void}
   */
  handleSubmit = () => {
    const { id, name, address, contactPerson, tel } = this.state;
    const vendor = {
      name,
      address,
      contactPerson,
      tel
    };
    if (this.state.modalTitle === "ADD VENDOR") {
      this.props.createVendor(vendor)
        .then(() => this.closeModal());
    } else {
      this.props.updateVendor(id, vendor)
        .then(() => this.closeModal());
    }
  }
  /**
   * Handles form validation
   * 
   * @param {object} event
   * 
   * @memberof AddVendorModal
   * 
   * @returns {void}
   */
  formValidation = (event) => {
    event.preventDefault();
    const err = inputValidation(this.state);
    if (err.isEmpty) {
      this.handleSubmit();
    } else {
      this.setState({ errors: err.errors });
    }
  }

  /**
   *  Clears errors Input field onFocus
   * 
   * @member clearErrors
   * 
   * @param {void} void
   * 
   * @memberof AddVendorModal
   * 
   * @returns {void}
   */
  clearErrors = () => {
    this.setState({ errors: {} });
  }
  
  /**
   * 
   * @method deleteVendor
   * 
   * @param {Object} vendorId
   * 
   * @memberof vendors
   * 
   * @returns {void}
   */
  deleteVendor = (vendorId) => {
    this.props.deleteVendor(vendorId)
      .then(() => this.closeModal());
  }

  /**
   * 
   * @method showDeleteModal
   *
   * @param {object} vendor
   * 
   * @memberof Vendors
   * 
   * @returns {void}
   */
  showDeleteModal = (vendor) => {
    this.setState({
      displayDeleteModal: true,
      modalContent: vendor
    });
  }

  /**
   * 
   * @method closeModal
   *
   * @param {object} vendor
   * 
   * @memberof Vendors
   * 
   * @returns {void}
   */
  closeModal = () => {
    this.setState(Vendors.initialState());
  }

  
  /**
   * @method renderVendor
   *
   * @memberof Vendors
   *
   * @param {object} vendor
   *
   * @returns {JSX}
   */
  renderVendor = (vendor) => {
    const rating = Math.ceil(Math.random() * 5);
    return (
      <VendorCard 
        key={vendor.id}
        vendor={vendor}
        rating={rating}
        showDeleteModal={this.showDeleteModal}
        showEditModal={this.showEditModal}
      />
    );
  }

  render() {
    const {
      isLoading,
      vendors,
      isCreating, 
      isDeleting,
      isUpdating
    } = this.props;
    const {
      displayModal,
      displayDeleteModal,
      modalContent,
      name, 
      address, 
      tel, 
      contactPerson,
      errors,
      modalTitle,
      modalButtontext
    } = this.state;

    return (
      <div>
        { isLoading && <Loader /> }
        <div className={`${isLoading && 'blurred'} table-wrapper`}>
          <div className="vendors-header">
            <h3 className="vendor-menu">Menu</h3>
            <button 
              type="button"
              name="addVendor" 
              className="vendor-button"
              onClick={this.showAddModal}
            >
              Add Vendor
            </button>
          </div>

          { vendors.length > 0 && (
          <div className="table-header custom-row">
            <div className="custom-col-4">Name</div>
            <div className="custom-col-2">Contacts</div>
            <div className="custom-col-2">Start Date</div>
            <div className="custom-col-2">End Date</div>
            <div className="custom-col-3">Rating</div>
            <div className="custom-col-3">Options</div>
          </div>)}

          { vendors.map((vendor) => (
            this.renderVendor(vendor))
          )}
          { !isLoading && !vendors.length && (
            <EmptyContent message="No vendor has been added yet" />
          )}

        </div>
        <ToastContainer />
        <Modal
          displayModal={displayModal}
          closeModal={this.closeModal}
          isCreating={isCreating}
          isUpdating={isUpdating}
          handleSubmit={this.handleSubmit}
          onChange={this.onChange}
          name={name}
          address={address}
          tel={tel}
          contactPerson={contactPerson}
          formValidation={this.formValidation}
          errors={errors}
          modalTitle={modalTitle}
          modalButtontext={modalButtontext}
        />
        <DeleteVendorModal
          deleteVendor={this.deleteVendor}
          isDeleting={isDeleting}
          closeModal={this.closeModal}
          modalContent={modalContent}
          displayDeleteModal={displayDeleteModal}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ allVendors }) => ({
  isLoading: allVendors.isLoading,
  isCreating: allVendors.isCreating,
  isDeleting: allVendors.isDeleting,
  isUpdating: allVendors.isUpdating,
  vendors: allVendors.vendors
});
   

Vendors.propTypes = {
  deleteVendor: PropTypes.func,
  isLoading: PropTypes.bool,
  isCreating: PropTypes.bool,
  isDeleting: PropTypes.bool,
  isUpdating: PropTypes.bool,
  createVendor: PropTypes.func,
  updateVendor: PropTypes.func,
  vendors: PropTypes.arrayOf(PropTypes.shape({})),
  fetchVendors: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  {
    fetchVendors,
    deleteVendor,
    createVendor,
    updateVendor
  }
)(Vendors);
