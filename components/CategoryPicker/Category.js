import React, { useMemo } from 'react';
import { Animated } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { TouchableOpacity } from '../TouchableOpacity';
import { View } from '../View';

function Category({
  category,
  isSelected,
  index,
  scrollX,
  categoryDimensions,
  saveCategoryDimensions,
  style,
  onPress,
}) {
  function handlePress() {
    if (isSelected) {
      return;
    }

    if (onPress) {
      onPress(category);
    }
  }

  function onLayoutChange(event) {
    const { width } = event.nativeEvent.layout;

    saveCategoryDimensions(prevDimensions => ({
      ...prevDimensions,
      [index]: width,
    }));
  }

  // Width of all items before current one
  // Default 1 - because we want to start to interpolate first item when scroll is moved, keeping
  // transorm: 1 until it isn't
  const requiredXoffset = useMemo(() => {
    return _.reduce(
      _.keys(categoryDimensions),
      (res, categoryIndex) => {
        if (_.toInteger(categoryIndex) < index) {
          return res + _.toInteger(categoryDimensions[categoryIndex]);
        }

        return res;
      },
      1,
    );
  }, [categoryDimensions, index]);
  const currentItemWidth = useMemo(() => categoryDimensions[index] || 0, [
    categoryDimensions,
    index,
  ]); // 0 because of NaN error when multiplying with 0.5

  const inputRange = [
    -1, // Keep scale:1 if user tries to scroll in reverse direction & list is position: 0
    0,
    requiredXoffset,
    requiredXoffset + 4,
    requiredXoffset + 4 + currentItemWidth * 0.5,
    requiredXoffset + 20 + currentItemWidth,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.9, 0.6, 0],
  });
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.9, 0.6, 0],
  });
  const resolvedStyle = useMemo(
    () =>
      categoryDimensions[index] ? { opacity, transform: [{ scale }] } : {},
    [categoryDimensions, index, opacity, scale],
  );

  const textStyle = useMemo(
    () => [
      resolvedStyle,
      style.category,
      !isSelected && style.selectedCategory,
    ],

    [resolvedStyle, isSelected, style.category, style.selectedCategory],
  );

  return (
    <View onLayout={onLayoutChange}>
      <TouchableOpacity onPress={handlePress} style={style.container}>
        <Animated.Text style={textStyle}>{category.name}</Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

Category.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  categoryDimensions: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  saveCategoryDimensions: PropTypes.func.isRequired,
  scrollX: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

Category.defaultProps = {
  style: {},
  isSelected: false,
  onPress: undefined,
};

export default React.memo(connectStyle('shoutem.ui.Category')(Category));
