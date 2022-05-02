import React, { useCallback, useRef } from 'react';
import { FlatList } from 'react-native';
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
  const listRef = useRef();

  // useEffect(() => {
  //   // Problem je jer se postavi ref na prvom renderu - ali nista onda ne triggera re-render
  //   console.log(listRef);
  //   listRef?.current?.scrollToOffset({ animated: true, offset: 100 });
  // }, [listRef]);

  // useEffect(() => {
  //   console.log(listRef);
  //   _.delay(
  //     () => listRef?.current?.scrollToOffset({ animated: true, offset: 0 }),
  //     200,
  //   );
  // }, [listRef]);

  const renderItem = useCallback(
    ({ item: category }) => (
      <Category
        category={category}
        key={category.id}
        onPress={onCategorySelected}
        isSelected={selectedCategory.id === category.id}
      />
    ),
    [selectedCategory.id, onCategorySelected],
  );

  if (_.size(categories) < 2) {
    return null;
  }

  // console.log('render', listRef);

  return (
    <View style={style.container}>
      <FlatList
        horizontal
        ref={listRef}
        scrollToOverflowEnabled
        contentContainerStyle={style.listContainer}
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={renderItem}
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

export default React.memo(connectStyle('shoutem.ui.CategoryPicker')(CategoryPicker));
