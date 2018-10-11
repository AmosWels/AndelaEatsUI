import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImageView from './ImageView';
import AddMealFields from './AddMealFields';

import {
  validateAddMealImage, generateFormData
} from '../../../../helpers/mealsHelper';

import {
  addMealItem, setAddMealErrors, editMealItem
} from '../../../../actions/admin/mealItemsAction';

/**
 *
 *
 * @class Vendors
 * 
 * @extends {Component}
 */
class MealModal extends Component {
  static initalState = {
    image: {
      file: null,
      dataurl: null,
      error: null
    },

    name: '',
    type: '',
    desc: '',
  };

  constructor(props) {
    super(props);
    this.imageInput = createRef();
  
    this.mealTypes = [
      'Main',
      'Side',
      'Protein',
      'Soup',
    ];

    this.state = {
      ...MealModal.initalState
    };
  }

  componentDidUpdate(prevProps) {
    const { show } = this.props;
    if (prevProps.show && !show) {
      this.clearModal();
    }
  }

  /**
   *
   *
   * @description handle onChage event
   * 
   * @param { Object } event
   * 
   * @returns { undefined }
   */
  onChange = (event) => {
    const { errors } = this.props;
    const { name, value } = event.target;
    this.setState({ [name]: value });

    if (errors.length > 0) {
      this.props.setAddMealErrors([]);
    }
  }

  /**
   *
   *
   * @description handle onSubmit event
   * 
   * @param { Object } event
   * 
   * @returns { undefined }
   */
  onSubmit = (event) => {
    event.preventDefault();
    const formData = generateFormData(
      this.state,
      this.mealTypes
    );
    
    if (Array.isArray(formData)) {
      this.props.setAddMealErrors(formData);
    } else {
      const { edit, mealDetails } = this.props;
      if (edit) {
        return this.props.editMealItem(mealDetails.id, formData);
      }
      this.props.addMealItem(formData);
    }
  }

  static getDerivedStateFromProps({ mealDetails, edit }, { type }) {
    if (edit && !type) {
      const {
        id, name, image, mealType, description
      } = mealDetails;

      return {
        id,
        name,
        image: {
          dataurl: image
        },
        desc: description,
        type: mealType
      };
    }

    return null;
  }

  clearModal = () => {
    this.props.setAddMealErrors([]);

    this.setState({
      ...MealModal.initalState
    });

    if (this.imageInput.current) {
      this.imageInput.current.value = '';
    }
  }

  closeModal = () => {
    this.clearModal();
    this.props.toggleAddModal(null, false);
  }

  openFileDialog = () => {
    const { current: element } = this.imageInput;
    if (!element) return;

    element.click();
  }

  previewImage = () => {
    const { current: element } = this.imageInput;
    if (!element) return;

    const image = element.files[0];
    const status = validateAddMealImage(image);
    if (status === true) {
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
          image: {
            file: image,
            dataurl: reader.result,
            error: null
          }
        });
      };
      reader.readAsDataURL(image);
    } else {
      this.setState({
        image: {
          file: null,
          dataurl: null,
          error: status
        }
      });
    }
  }

  render() {
    const {
      show,
      edit,
      errors,
      isLoading,
      addBtnDisabled,
    } = this.props;
    
    const {
      name, type, desc, image: { dataurl }
    } = this.state;
  
    let { error } = this.state.image;

    error = (error === null && errors.includes('image'))
      ? 'No image has been selected'
      : error;

    return (
      <div
        className="modal"
        id="add-meal-modal"
        style={show ? { display: 'block' } : { display: 'none' }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <div className="header-title">{edit ? 'EDIT' : 'ADD'} MEAL</div>
            <div>
              <button
                tabIndex={0}
                type="button"
                className="close-icon btn-no-style"
                onClick={this.closeModal}
              >
                X&nbsp;&nbsp;Close
              </button>
            </div>
          </div>

          <form id="add-meal-form" onSubmit={this.onSubmit}>
            <input
              type="file"
              style={{ display: 'none' }}
              ref={this.imageInput}
              onChange={this.previewImage}
            />

            <main>
              <div>
                Upload meal thumbnail. &nbsp;
                <Link
                  to="#"
                  onClick={this.openFileDialog}
                >
                  Select from computer
                </Link>
              </div>

              <ImageView
                openFileDialog={this.openFileDialog}
                error={error}
                dataurl={dataurl}
              />

              <AddMealFields
                state={{
                  name,
                  desc,
                  type,
                }}
                errors={errors}
                onChange={this.onChange}
                mealTypes={this.mealTypes}
              />
            </main>

            <div className="modal-footer">
              <div>
                <div
                  className="loader-wheel"
                  style={{ display: isLoading ? 'inline-block' : 'none' }}
                />
              </div>

              <button
                type="button"
                className="grayed"
                onClick={this.closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addBtnDisabled}
              >
                {edit ? 'Update' : 'Add'} meal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

MealModal.propTypes = {
  show: PropTypes.bool,
  edit: PropTypes.bool,
  toggleAddModal: PropTypes.func.isRequired,
  addMealItem: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool,
  addBtnDisabled: PropTypes.bool,
  setAddMealErrors: PropTypes.func.isRequired,
  mealDetails: PropTypes.shape({}),
  editMealItem: PropTypes.func,
};

const mapStateToProps = ({ mealItems: { mealModal } }) => ({
  isLoading: mealModal.isLoading,
  addBtnDisabled: mealModal.addBtnDisabled,
  errors: mealModal.errors,
  edit: mealModal.edit,
});

export default connect(mapStateToProps, {
  addMealItem,
  setAddMealErrors,
  editMealItem
})(MealModal);
