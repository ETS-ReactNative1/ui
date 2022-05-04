import React, { useCallback, useRef, useState } from 'react';
import { Animated, FlatList } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '../View';
import Category from './Category';

const categoryShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
});

export function CategoryPicker({
  categories,
  onCategorySelected,
  style,
  selectedCategory,
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [categoryDimensions, setCategoryDimensions] = useState({});

  const renderItem = useCallback(
    ({ index, item: category }) => {
      return (
        <Category
          index={index}
          category={category}
          onPress={onCategorySelected}
          isSelected={selectedCategory.id === category.id}
          scrollX={scrollX}
          categoryDimensions={categoryDimensions}
          saveCategoryDimensions={setCategoryDimensions}
        />
      );
    },
    [selectedCategory.id, onCategorySelected, categoryDimensions],
  );

  if (_.size(categories) < 2) {
    return null;
  }


  return (
    <View style={style.container}>
      <Animated.FlatList
        data={categories}
        renderItem={renderItem}
        horizontal
        scrollToOverflowEnabled
        contentContainerStyle={style.listContainer}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
      />
    </View>
  );
}

CategoryPicker.propTypes = {
  categories: PropTypes.arrayOf(categoryShape),
  selectedCategory: categoryShape,
  style: PropTypes.object,
  onCategorySelected: PropTypes.func,
};

CategoryPicker.defaultProps = {
  categories: [],
  style: {},
  selectedCategory: undefined,
  onCategorySelected: undefined,
};

export default React.memo(
  connectStyle('shoutem.ui.CategoryPicker')(CategoryPicker),
);
