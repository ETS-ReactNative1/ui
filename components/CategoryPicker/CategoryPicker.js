import React, { useCallback, useRef } from 'react';
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
  const listRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

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
    ({ index, item: category }) => {
      // console.log(index)

      const inputRange = [
        -1, 0, 10 * index, 10 * (index + 2)
      ];
      const scale = scrollX.interpolate({inputRange, outputRange: [1,1,1,0]})
      console.log(scrollX)

      return (
        <Animated.View style={{transform: [{scale}]}}>
          <Category
            category={category}
            key={category.id}
            onPress={onCategorySelected}
            isSelected={selectedCategory.id === category.id}
          />
      </Animated.View>
    )},
    [selectedCategory.id, onCategorySelected]
  );

  if (_.size(categories) < 2) {
    return null;
  }

  // console.log('render', listRef);

  return (
    <View style={style.container}>
      <Animated.FlatList
        data={categories}
        renderItem={renderItem}
        ref={listRef}
        horizontal
        scrollToOverflowEnabled
        contentContainerStyle={style.listContainer}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], { useNativeDriver: true})}
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
