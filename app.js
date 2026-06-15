import React, { useState } from 'react';

import {View,Text,TouchableOpacity,StyleSheet,TextInput,FlatList,SafeAreaView,ScrollView,Modal,
} from 'react-native';

const COURSES = ['Starter', 'Main', 'Dessert', 'Drinks'];

export default function App() {
  const [screen, setScreen] = useState('menu');

  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);

  const [selectedDish, setSelectedDish] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  const [showCourseMenu, setShowCourseMenu] = useState(false);

  // Added: Filter state
  const [filterCourse, setFilterCourse] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const addDish = () => {
    if (!name || !price || !course) return;

    const newDish = {
      id: Date.now().toString(),
      name,
      description,
      course,
      price,
    };

    setDishes([...dishes, newDish]);

    setName('');
    setDescription('');
    setCourse('');
    setPrice('');

    setScreen('currentMenu');
  };

  // Added: Remove dish
  const removeDish = (id) => {
    setDishes(dishes.filter((d) => d.id !== id));
  };

  const placeOrder = (dish) => {
    setOrders([...orders, dish]);
    setScreen('orders');
  };

  // Added: Average price per course
  const avgByCourse = COURSES.map((c) => {
    const items = dishes.filter((d) => d.course === c);
    if (items.length === 0) return null;
    const avg =
      items.reduce((sum, d) => sum + parseFloat(d.price), 0) / items.length;
    return { course: c, avg: avg.toFixed(2), count: items.length };
  }).filter(Boolean);

  // NEW: filtered dishes list
  const filteredDishes =
    filterCourse === 'All'
      ? dishes
      : dishes.filter((d) => d.course === filterCourse);

  if (screen === 'menu') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Customer Menu</Text>

        {/* Added: Average price summary */}
        {avgByCourse.length > 0 && (
          <View style={styles.avgContainer}>
            <Text style={styles.avgHeading}>
              Average Price by Course
            </Text>
            <View style={styles.avgRow}>
              {avgByCourse.map(({ course: c, avg, count }) => (
                <View key={c} style={styles.avgCard}>
                  <Text style={styles.avgCourse}>{c}</Text>
                  <Text style={styles.avgPrice}>R{avg}</Text>
                  <Text style={styles.avgCount}>
                    {count} item{count !== 1 ? 's' : ''}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Added: Filter button */}
        {dishes.length > 0 && (
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterMenu(true)}
            >
              <Text style={styles.filterButtonText}>
                Filter: {filterCourse}
              </Text>
            </TouchableOpacity>

            <Modal
              transparent
              visible={showFilterMenu}
              animationType="fade"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  {['All', ...COURSES].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.modalItem}
                      onPress={() => {
                        setFilterCourse(item);
                        setShowFilterMenu(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalText,
                          filterCourse === item && styles.modalTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={() => setShowFilterMenu(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}

        {filteredDishes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {dishes.length === 0
                ? 'No dishes available yet'
                : `No ${filterCourse} dishes available`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredDishes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setSelectedDish(item);
                  setScreen('details');
                }}
              >
                <View style={styles.imagePlaceholder} />

                <Text style={styles.cardTitle}>{item.name}</Text>

                <Text style={styles.cardText}>{item.description}</Text>

                <Text style={styles.cardText}>{item.course}</Text>

                <Text style={styles.cardPrice}>R{item.price}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => setScreen('dashboard')}
        >
          <Text style={styles.adminText}>Admin Dashboard</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'dashboard') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setScreen('orders')}
        >
          <Text style={styles.buttonText}>Client Orders</Text>
        </TouchableOpacity>

        {/* CURRENT MENU */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScreen('currentMenu')}
        >
          <Text style={styles.buttonText}>Current Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setScreen('addDish')}
        >
          <Text style={styles.buttonText}>Add to Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen('menu')}>
          <Text style={styles.back}>Back to Customer Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'addDish') {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add Dish</Text>

        <TextInput
          placeholder="Dish Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Description"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Select Course</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowCourseMenu(true)}
        >
          <Text style={styles.dropdownText}>
            {course || 'Choose Course'}
          </Text>
        </TouchableOpacity>

        <Modal
          transparent
          visible={showCourseMenu}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              {COURSES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    setCourse(item);
                    setShowCourseMenu(false);
                  }}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setShowCourseMenu(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TextInput
          placeholder="Price"
          keyboardType="numeric"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity style={styles.button} onPress={addDish}>
          <Text style={styles.buttonText}>Save Dish</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen('dashboard')}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === 'currentMenu') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Current Menu</Text>

        {dishes.length === 0 ? (
          <Text>No dishes added yet.</Text>
        ) : (
          <FlatList
            data={dishes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.imagePlaceholder} />

                <Text style={styles.cardTitle}>{item.name}</Text>

                <Text style={styles.cardText}>{item.description}</Text>

                <Text style={styles.cardText}>{item.course}</Text>

                <Text style={styles.cardPrice}>R{item.price}</Text>

                {/* NEW: Remove button */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeDish(item.id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <TouchableOpacity onPress={() => setScreen('dashboard')}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'orders') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Client Orders</Text>

        {orders.length === 0 ? (
          <Text>No orders yet.</Text>
        ) : (
          orders.map((item, index) => (
            <View key={index} style={styles.orderCard}>
              <Text style={styles.cardTitle}>{item.name}</Text>

              <Text style={styles.cardText}>{item.course}</Text>

              <Text style={styles.cardText}>R{item.price}</Text>
            </View>
          ))
        )}

        <TouchableOpacity onPress={() => setScreen('dashboard')}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'details') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.largeImage} />

        <Text style={styles.detailTitle}>{selectedDish?.name}</Text>

        <Text style={styles.detailText}>{selectedDish?.description}</Text>

        <Text style={styles.detailText}>{selectedDish?.course}</Text>

        <Text style={styles.detailPrice}>R{selectedDish?.price}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => placeOrder(selectedDish)}
        >
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 20,
    paddingTop: 60,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  dropdown: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  dropdownText: {
    fontSize: 16,
    color: '#000',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 12,
    padding: 20,
  },

  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },

  modalText: {
    fontSize: 16,
  },

  modalTextActive: {
    fontWeight: 'bold',
  },

  cancelText: {
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    color: 'red',
  },

  card: {
    backgroundColor: '#EAEAEA',
    width: '47%',
    margin: '1.5%',
    padding: 12,
    borderRadius: 12,
  },

  imagePlaceholder: {
    height: 90,
    backgroundColor: '#D1D1D1',
    borderRadius: 10,
    marginBottom: 10,
  },

  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  cardText: {
    color: '#666',
    marginBottom: 5,
  },

  cardPrice: {
    fontWeight: 'bold',
  },

  largeImage: {
    height: 220,
    backgroundColor: '#D9D9D9',
    borderRadius: 14,
    marginBottom: 20,
  },

  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  detailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },

  detailPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  orderCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  adminButton: {
    marginTop: 15,
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  adminText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#777',
  },

  back: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },

  // NEW styles
  avgContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
  },

  avgHeading: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  avgRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  avgCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },

  avgCourse: {
    fontSize: 11,
    color: '#888',
  },

  avgPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  avgCount: {
    fontSize: 11,
    color: '#AAA',
  },

  filterRow: {
    marginBottom: 12,
  },

  filterButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },

  removeButton: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  removeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
