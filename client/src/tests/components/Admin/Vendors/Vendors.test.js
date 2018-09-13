/* eslint-disable no-undef */
import React, { Component } from 'react';
import { mount } from 'enzyme';
import { Vendors } from '../../../../components/Admin/Vendors/Vendors';
import vendors from '../../../__mocks__/mockVendors';

const setup = (isLoading) => {
  const props = {
    vendors,
    isLoading,
    fetchVendors: jest.fn(),
    createVendor: jest.fn().mockImplementation(() => Promise.resolve())
  };

  return mount(<Vendors {...props} />);
};

const wrapper = setup(false);

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

  it('should call toggleModal method', () => {
    const toggleModalSpy = jest.spyOn(wrapper.instance(), 'toggleModal');
    const event = { preventDefault: jest.fn() };
    wrapper.instance().toggleModal(event);
    expect(toggleModalSpy).toHaveBeenCalled();
  });

  it('should call handleSubmit method', () => {
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const event = { preventDefault: jest.fn() };
    wrapper.instance().handleSubmit(event);
    expect(handleSubmitSpy).toHaveBeenCalled();
  });
});
