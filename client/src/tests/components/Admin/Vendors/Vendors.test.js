/* eslint-disable no-undef */
import React, { Component } from 'react';
import { mount } from 'enzyme';
import { Vendors } from '../../../../components/Admin/Vendors/Vendors';
import vendors from '../../../__mocks__/mockVendors';

const modalContent = {
  contactPerson: "Chibueze",
  createdAt: "Fri, 14 Sep 2018 06:52:30 GMT",
  id: "-LMLqYeE1Ubdy79p4Nwo",
  phoneNumber: "01234567890",
  updatedAt: "Fri, 14 Sep 2018 06:52:30 GMT",
  vendorAddress: "No 233, Ikorodu road, Lagos",
  vendorName: "Mr Medium"
};

const setup = (isLoading, isCreating, isUpdating, isDeleting) => {
  const props = {
    vendors,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchVendors: jest.fn(),
    createVendor: jest.fn().mockImplementation(() => Promise.resolve()),
    deleteVendor: jest.fn().mockImplementation(() => Promise.resolve()),
    updateVendor: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  return mount(<Vendors {...props} />);
};

const wrapper = setup(false, false, false, false);

describe('Vendors Component', () => {
  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should have a VendorCard component', () => {
    expect(wrapper.find('VendorCard').exists()).toBe(true);
  });

  it('should call renderVendor method', () => {
    const renderVendorSpy = jest.spyOn(wrapper.instance(), 'renderVendor');
    wrapper.instance().renderVendor(vendors[0]);
    expect(renderVendorSpy).toHaveBeenCalled();
    expect(renderVendorSpy).toHaveBeenCalledWith(vendors[0]);
  });

  it('should call handleSubmit and createVendor method', () => {
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    wrapper.setState({ modalTitle: "ADD VENDOR" });
    wrapper.instance().handleSubmit();
    expect(handleSubmitSpy).toHaveBeenCalled();
  });

  it('should call handleSubmit and updateVendor method', () => {
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    wrapper.instance().handleSubmit();
    expect(handleSubmitSpy).toHaveBeenCalled();
  });

  it('should call deleteVendor method', () => {
    const deleteVendorSpy = jest.spyOn(wrapper.instance(), 'deleteVendor');
    wrapper.instance().deleteVendor();
    expect(deleteVendorSpy).toHaveBeenCalled();
  });

  it('should call closeDeleteModal method', () => {
    const closeModalSpy = jest
      .spyOn(wrapper.instance(), 'closeModal');
    const event = { preventDefault: jest.fn() };
    wrapper.instance().closeModal();
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should call closeDeleteModal method', () => {
    const showDeleteModalSpy = jest
      .spyOn(wrapper.instance(), 'showDeleteModal');
    wrapper.instance().showDeleteModal(modalContent);
    expect(showDeleteModalSpy).toHaveBeenCalled();
  });

  it('should call clearErrors method', () => {
    const clearErrorsSpy = jest.spyOn(wrapper.instance(), 'clearErrors');
    wrapper.instance().clearErrors();
    expect(clearErrorsSpy).toHaveBeenCalled();
  });

  it('should call formValidation method', () => {
    const formValidationSpy = jest.spyOn(wrapper.instance(), 'formValidation');
    const event = { preventDefault: jest.fn() };
    wrapper.instance().formValidation(event);
    expect(formValidationSpy).toHaveBeenCalled();
  });

  it('should call onChange method', () => {
    const onChangeSpy = jest.spyOn(wrapper.instance(), 'onChange');
    const event = {
      preventDefault: jest.fn(),
      target: {
        name: 'vendorName',
        value: 'Chibueze'
      }
    };
    wrapper.instance().onChange(event);
    expect(onChangeSpy).toHaveBeenCalled();
    expect(wrapper.state().vendorName).toBe('Chibueze');
  });

  it('should call closeModal method', () => {
    const closeModalSpy = jest.spyOn(wrapper.instance(), 'closeModal');
    wrapper.instance().closeModal();
    expect(closeModalSpy).toHaveBeenCalled();
  });

  it('should call deleteVendor method', () => {
    const deleteVendorSpy = jest.spyOn(wrapper.instance(), 'deleteVendor');
    wrapper.instance().deleteVendor(modalContent.id);
    expect(deleteVendorSpy).toHaveBeenCalled();
  });

  it('should call showAddModal method', () => {
    const showAddModalSpy = jest.spyOn(wrapper.instance(), 'showAddModal');
    wrapper.instance().showAddModal();
    expect(showAddModalSpy).toHaveBeenCalled();
  });

  it('should call showEditModal method', () => {
    const showEditModalSpy = jest.spyOn(wrapper.instance(), 'showEditModal');
    wrapper.instance().showEditModal(modalContent);
    expect(showEditModalSpy).toHaveBeenCalled();
  });
});
