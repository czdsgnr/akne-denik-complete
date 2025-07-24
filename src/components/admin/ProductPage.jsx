import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Eye,
  Star,
  DollarSign,
  Tag,
  Image
} from 'lucide-react'
import { db } from '../../lib/firebase'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc
} from 'firebase/firestore'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inStock: true,
    imageUrl: '',
    features: ''
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'))
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(productsData)
    } catch (error) {
      console.error('Chyba při načítání produktů:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      inStock: true,
      imageUrl: '',
      features: ''
    })
    setEditingProduct(null)
    setShowAddForm(false)
    setIsEditing(false)
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      inStock: product.inStock ?? true,
      imageUrl: product.imageUrl || '',
      features: Array.isArray(product.features) ? product.features.join('\n') : (product.features || '')
    })
    setEditingProduct(product)
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        features: formData.features.split('\n').filter(f => f.trim()),
        updatedAt: new Date()
      }

      if (editingProduct) {
        // Update existing product
        await updateDoc(doc(db, 'products', editingProduct.id), productData)
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...productData } : p
        ))
      } else {
        // Add new product
        productData.createdAt = new Date()
        const docRef = await addDoc(collection(db, 'products'), productData)
        setProducts([...products, { id: docRef.id, ...productData }])
      }

      resetForm()
    } catch (error) {
      console.error('Chyba při ukládání produktu:', error)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Opravdu chcete smazat tento produkt?')) {
      try {
        await deleteDoc(doc(db, 'products', productId))
        setProducts(products.filter(p => p.id !== productId))
      } catch (error) {
        console.error('Chyba při mazání produktu:', error)
      }
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK'
    }).format(price || 0)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Načítání produktů...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Správa produktů</h1>
          <p className="text-gray-600 mt-1">FaceDeluxe a další produkty ({products.length})</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-pink-600 hover:bg-pink-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Přidat produkt</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || isEditing) && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isEditing ? 'Upravit produkt' : 'Přidat nový produkt'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <Label htmlFor="name">Název produktu *</Label>
                <Input
                  id="name"
                  placeholder="FaceDeluxe Premium Krém"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Cena (CZK) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="1299"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategorie</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Vyberte kategorii</option>
                  <option value="krémy">Krémy</option>
                  <option value="séra">Séra</option>
                  <option value="čisticí">Čisticí produkty</option>
                  <option value="doplňky">Doplňky</option>
                  <option value="sady">Sady produktů</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL obrázku</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Popis produktu</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Luxusní krém pro péči o problematickou pleť..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Vlastnosti (každá na novém řádku)</Label>
              <Textarea
                id="features"
                rows={4}
                placeholder="Redukuje akné a pupínky&#10;Hydratuje pokožku&#10;Obsahuje kyselinu salicylovou&#10;Vhodné pro citlivou pleť"
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                checked={formData.inStock}
                onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <Label htmlFor="inStock">Skladem</Label>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={!formData.name || !formData.price}
                className="bg-pink-600 hover:bg-pink-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Uložit změny' : 'Přidat produkt'}</span>
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Zrušit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Žádné produkty</h3>
            <p className="text-gray-500 mb-6">Přidejte první produkt jako FaceDeluxe</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-pink-600 hover:bg-pink-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Přidat FaceDeluxe</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-t-xl flex items-center justify-center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-xl"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className={`flex items-center justify-center w-full h-full ${product.imageUrl ? 'hidden' : 'flex'}`}>
                    <Image className="w-12 h-12 text-pink-300" />
                  </div>
                </div>

                <div className="p-6">
                  
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <div className="flex items-center space-x-2">
                        {product.category && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            <Tag className="w-3 h-3 mr-1" />
                            {product.category}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          product.inStock 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.inStock ? 'Skladem' : 'Nedostupné'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Klíčové vlastnosti:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {product.features.length > 3 && (
                          <li className="text-gray-500">
                            +{product.features.length - 3} dalších vlastností
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Upravit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center justify-center px-3 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  )
}

export default ProductsPage