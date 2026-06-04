import {
  deleteCategoryAction,
  deleteProductAction,
  saveCategoryAction,
  saveProductAction,
} from '@/app/admin/actions';
import { Card, Checkbox, Field, SaveButton, TextArea } from '@/components/admin/admin-fields';
import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button';
import { ProductImageField } from '@/components/admin/product-image-field';
import type { SiteData, StoreCategory, StoreProduct } from '@/lib/types';

export const ProductForms = ({ data }: { data: SiteData }) => (
  <div className="grid gap-6">
    <CategoryManager categories={data.categories} />
    <Card title="Crear producto">
      <ProductForm categories={data.categories} />
    </Card>
    <Card title="Productos existentes">
      <div className="grid gap-5">
        {data.products.map((product) => (
          <div key={product.id} className="rounded-[1.25rem] border border-border bg-muted/20 p-5">
            <ProductForm product={product} categories={data.categories} />
            <div className="mt-3">
              <DeleteConfirmButton
                action={deleteProductAction}
                id={product.id}
                label="Eliminar producto"
                title="¿Eliminar producto?"
                description={`Se eliminará "${product.name}" de forma permanente. Esta acción no se puede deshacer.`}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const ProductForm = ({
  product,
  categories,
}: {
  product?: StoreProduct;
  categories: StoreCategory[];
}) => (
  <form action={saveProductAction} className="grid gap-4 md:grid-cols-3">
    {product ? <input type="hidden" name="id" value={product.id} /> : null}
    <Field label="Nombre" name="name" defaultValue={product?.name ?? ''} />
    <Field label="Slug" name="slug" defaultValue={product?.slug ?? ''} required={false} />
    <Field label="Precio" name="price" type="number" defaultValue={product?.price ?? 0} />
    <Field label="Badge" name="badge" defaultValue={product?.badge ?? ''} required={false} />
    <Field label="Orden" name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 0} />
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-accent">Categoría</span>
      <select
        name="categoryId"
        defaultValue={product?.categoryId ?? categories[0]?.id}
        className="mt-2 flex h-11 w-full rounded-2xl border border-input bg-white px-4 py-3 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </label>
    <div className="md:col-span-2">
      <ProductImageField
        label="Imagen principal / URL local"
        name="imageUrl"
        defaultValue={product?.imageUrl ?? ''}
      />
    </div>
    <TextArea label="Descripción" name="description" defaultValue={product?.description ?? ''} />
    <Checkbox label="Visible" name="isVisible" defaultChecked={product?.isVisible ?? true} />
    <Checkbox label="Destacado" name="isFeatured" defaultChecked={product?.isFeatured ?? true} />
    <div className="md:col-span-3">
      <SaveButton label={product ? 'Guardar producto' : 'Crear producto'} />
    </div>
  </form>
);

const CategoryManager = ({ categories }: { categories: StoreCategory[] }) => (
  <Card title="Categorías">
    <div className="grid gap-5">
      <form action={saveCategoryAction} className="grid gap-4 md:grid-cols-4">
        <Field label="Nombre" name="name" />
        <Field label="Slug" name="slug" required={false} />
        <Field label="Orden" name="sortOrder" type="number" defaultValue={categories.length + 1} />
        <Checkbox label="Visible" name="isVisible" defaultChecked />
        <div className="md:col-span-4">
          <SaveButton label="Crear categoría" />
        </div>
      </form>
      {categories.map((category) => (
        <div key={category.id} className="rounded-[1.25rem] border border-border bg-muted/20 p-5">
          <form action={saveCategoryAction} className="grid gap-4 md:grid-cols-4">
            <input type="hidden" name="id" value={category.id} />
            <Field label="Nombre" name="name" defaultValue={category.name} />
            <Field label="Slug" name="slug" defaultValue={category.slug} />
            <Field label="Orden" name="sortOrder" type="number" defaultValue={category.sortOrder} />
            <Checkbox label="Visible" name="isVisible" defaultChecked={category.isVisible} />
            <div className="md:col-span-4">
              <SaveButton label="Guardar categoría" />
            </div>
          </form>
          <div className="mt-3">
            <DeleteConfirmButton
              action={deleteCategoryAction}
              id={category.id}
              label="Eliminar si no tiene productos"
              title="¿Eliminar categoría?"
              description={`Se eliminará "${category.name}" solo si no tiene productos asociados.`}
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);
