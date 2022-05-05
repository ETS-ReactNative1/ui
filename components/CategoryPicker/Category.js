import React, { useCallback, useMemo } from 'react';
import { Animated, Dimensions, LayoutAnimation } from 'react-native';
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
  const itemWidth = useMemo(() => categoryDimensions[index] || 0, [
    categoryDimensions,
    index,
  ]); // 0 because of NaN error when multiplying with 0.5



  const calculateInitialScale = useCallback(() => {
    const screenWidth = Dimensions.get('screen').width;
    const listWidth = screenWidth - 16; // paddings

    if ((listWidth < requiredXoffset + 20)) {
      return 0;
    }

    // If half of the item is outside the list (right side)
    if (((requiredXoffset + itemWidth) - listWidth) > itemWidth * 0.5) {
      return 0.6
    }

    if ((listWidth - requiredXoffset - 4) === itemWidth) {
      return 0.9;
    }

   return 1
  }, [index, itemWidth, requiredXoffset])

  const screenWidth = Dimensions.get('screen').width;
  const listWidth = screenWidth - 16; // paddings

  

  const inputRange = [
    -1,
    0,
    requiredXoffset,
    requiredXoffset + (index === 0 ? 4 : 30), // 0.9
    requiredXoffset + 30 + itemWidth * 0.3, // 0.6
    requiredXoffset + 30 + itemWidth * 0.8, // 0
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.9, 0.4, 0],
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.9, 0.4, 0],
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
