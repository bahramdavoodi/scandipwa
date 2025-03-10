/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import ExpandableContent from 'Component/ExpandableContent';
import ExpandableContentShowMore from 'Component/ExpandableContentShowMore';
import ProductAttributeValue from 'Component/ProductAttributeValue/ProductAttributeValue.component';
// eslint-disable-next-line max-len
import ProductConfigurableAttributes from 'Component/ProductConfigurableAttributes/ProductConfigurableAttributes.component';
import { formatPrice } from 'Util/Price';

/** @namespace Component/CategoryConfigurableAttributes/Component */
export class CategoryConfigurableAttributes extends ProductConfigurableAttributes {
    getPriceLabel(option) {
        const { currency_code } = this.props;
        const { label } = option;
        const [from, to] = label.split('~');
        const priceFrom = formatPrice(from, currency_code);
        const priceTo = formatPrice(to, currency_code);

        if (from === '*') {
            return __('Up to %s', priceTo);
        }

        if (to === '*') {
            return __('From %s', priceFrom);
        }

        return __('From %s, to %s', priceFrom, priceTo);
    }

    renderPriceSwatch(option) {
        const { attribute_options, ...priceOption } = option;

        if (attribute_options) {
            // do not render price filter if it includes "*_*" aggregation
            if (attribute_options['*_*']) {
                return null;
            }

            priceOption.attribute_options = Object.entries(attribute_options).reduce((acc, [key, option]) => {
                acc[key] = {
                    ...option,
                    label: this.getPriceLabel(option)
                };

                return acc;
            }, {});
        }

        return this.renderDropdownOrSwatch(priceOption);
    }

    renderDropdownOrSwatch(option) {
        const {
            isContentExpanded,
            getSubHeading
        } = this.props;

        const {
            attribute_label,
            attribute_code,
            attribute_options
        } = option;

        const [{ swatch_data }] = attribute_options ? Object.values(attribute_options) : [{}];
        const isSwatch = !!swatch_data;

        return (
            <ExpandableContent
              key={ attribute_code }
              heading={ attribute_label }
              subHeading={ getSubHeading(option) }
              mix={ {
                  block: 'ProductConfigurableAttributes',
                  elem: 'Expandable'
              } }
              isContentExpanded={ isContentExpanded }
            >
                { isSwatch ? this.renderSwatch(option) : this.renderDropdown(option) }
            </ExpandableContent>
        );
    }

    renderConfigurableAttributeValue(attribute) {
        const {
            getIsConfigurableAttributeAvailable,
            handleOptionClick,
            getLink,
            isSelected,
            show_product_count
        } = this.props;

        const { attribute_value } = attribute;

        return (
            <ProductAttributeValue
              key={ attribute_value }
              attribute={ attribute }
              isSelected={ isSelected(attribute) }
              isAvailable={ getIsConfigurableAttributeAvailable(attribute) }
              onClick={ handleOptionClick }
              getLink={ getLink }
              isProductCountVisible={ show_product_count }
            />
        );
    }

    renderConfigurableOption = (option) => {
        const { attribute_code } = option;

        switch (attribute_code) {
        case 'price':
            return this.renderPriceSwatch(option);
        default:
            return this.renderDropdownOrSwatch(option);
        }
    };

    renderConfigurableAttributes() {
        const { configurable_options } = this.props;

        return Object.values(configurable_options)
            .map(this.renderConfigurableOption);
    }

    renderDropdown(option) {
        const { attribute_values } = option;

        return (
            <div
              block="ProductConfigurableAttributes"
              elem="DropDownList"
            >
                <ExpandableContentShowMore>
                    { attribute_values.map((attribute_value) => (
                        this.renderConfigurableAttributeValue({ ...option, attribute_value })
                    )) }
                </ExpandableContentShowMore>
            </div>
        );
    }
}

export default CategoryConfigurableAttributes;
