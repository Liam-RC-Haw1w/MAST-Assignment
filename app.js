import React, { useState } from 'react';

import {View,Text,TouchableOpacity,StyleSheet,TextInput,FlatList,SafeAreaView,ScrollView,Modal,} from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('menu');

  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);

  const [selectedDish, setSelectedDish] =
    useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] =
    useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  
  const [showCourseMenu, setShowCourseMenu] =
    useState(false);

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

  const placeOrder = (dish) => {
    setOrders([...orders, dish]);
    setScreen('orders');
  };

  if (screen === 'menu') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Customer Menu
        </Text>

        {dishes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              No dishes available yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={dishes}
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
                <View
                  style={
                    styles.imagePlaceholder
                  }
                />

                <Text style={styles.cardTitle}>
                  {item.name}
                </Text>

                <Text style={styles.cardText}>
                  {item.description}
                </Text>

                <Text style={styles.cardText}>
                  {item.course}
                </Text>

                <Text style={styles.cardPrice}>
                  R{item.price}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.adminButton}
          onPress={() =>
            setScreen('dashboard')
          }
        >
          <Text style={styles.adminText}>
            Admin Dashboard
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'dashboard') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Dashboard
        </Text>

        
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setScreen('orders')
          }
        >
          <Text style={styles.buttonText}>
            Client Orders
          </Text>
        </TouchableOpacity>

        {/* CURRENT MENU */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setScreen('currentMenu')
          }
        >
          <Text style={styles.buttonText}>
            Current Menu
          </Text>
        </TouchableOpacity>

        
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setScreen('addDish')
          }
        >
          <Text style={styles.buttonText}>
            Add to Menu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setScreen('menu')}
        >
          <Text style={styles.back}>
            Back to Customer Menu
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'addDish') {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Add Dish
        </Text>

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

        
        <Text style={styles.label}>
          Select Course
        </Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() =>
            setShowCourseMenu(true)
          }
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
              {[
                'Starter',
                'Main',
                'Dessert',
                'Drinks',
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    setCourse(item);
                    setShowCourseMenu(false);
                  }}
                >
                  <Text
                    style={styles.modalText}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() =>
                  setShowCourseMenu(false)
                }
              >
                <Text
                  style={styles.cancelText}
                >
                  Cancel
                </Text>
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

        <TouchableOpacity
          style={styles.button}
          onPress={addDish}
        >
          <Text style={styles.buttonText}>
            Save Dish
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setScreen('dashboard')
          }
        >
          <Text style={styles.back}>
            Back
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === 'currentMenu') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Current Menu
        </Text>

        {dishes.length === 0 ? (
          <Text>No dishes added yet.</Text>
        ) : (
          <FlatList
            data={dishes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View
                  style={
                    styles.imagePlaceholder
                  }
                />

                <Text style={styles.cardTitle}>
                  {item.name}
                </Text>

                <Text style={styles.cardText}>
                  {item.description}
                </Text>

                <Text style={styles.cardText}>
                  {item.course}
                </Text>

                <Text style={styles.cardPrice}>
                  R{item.price}
                </Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          onPress={() =>
            setScreen('dashboard')
          }
        >
          <Text style={styles.back}>
            Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'orders') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          Client Orders
        </Text>

        {orders.length === 0 ? (
          <Text>No orders yet.</Text>
        ) : (
          orders.map((item, index) => (
            <View
              key={index}
              style={styles.orderCard}
            >
              <Text
                style={styles.cardTitle}
              >
                {item.name}
              </Text>

              <Text
                style={styles.cardText}
              >
                {item.course}
              </Text>

              <Text
                style={styles.cardText}
              >
                R{item.price}
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity
          onPress={() =>
            setScreen('dashboard')
          }
        >
          <Text style={styles.back}>
            Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (screen === 'details') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.largeImage} />

        <Text style={styles.detailTitle}>
          {selectedDish?.name}
        </Text>

        <Text style={styles.detailText}>
          {selectedDish?.description}
        </Text>

        <Text style={styles.detailText}>
          {selectedDish?.course}
        </Text>

        <Text style={styles.detailPrice}>
          R{selectedDish?.price}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            placeOrder(selectedDish)
          }
        >
          <Text style={styles.buttonText}>
            Place Order
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

